import { exec } from "child_process";
import mongoose from "mongoose";
import User from "@srvr/models/user.model.ts";
import bcrypt from "bcrypt";
import {
  envMongoDBUsername,
  envMongoDBPassword,
  envMongoDBHost,
  envMongoDBPort,
  envMongoDBDbname,
} from "@srvr/configs/env.config.ts";
import Classroom from "@srvr/models/classroom.model.ts";

import Projects from "@srvr/models/projects.model.ts";

const uri = `mongodb://${envMongoDBUsername}:${envMongoDBPassword}@${envMongoDBHost}:${envMongoDBPort}/${envMongoDBDbname}?authSource=admin`;

const checkMongoHealth = () =>
  new Promise((resolve) => {
    exec(
      "docker exec mongodb mongosh --eval 'db.runCommand({ ping: 1 })' --quiet",
      (error, stdout, stderr) => {
        if (error || stderr) {
          return resolve(false);
        }
        resolve(stdout.includes("ok"));
      },
    );
  });

const MongoDB = async () => {
  let isMongoDBHealthy: boolean = false;
  while (!isMongoDBHealthy) {
    const healthy = await checkMongoHealth();
    try {
      if (healthy) {
        console.log("✅ MongoDB is healthy");
        isMongoDBHealthy = true;
        break;
      }
    } catch (err) {
      console.log("❌ Error checking MongoDB health:", err);
    }

    console.log("⏳ Waiting for MongoDB...");
    await new Promise((res) => setTimeout(res, 2000));
  }

  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(uri);
    console.log(`✅ MongoDB connected`);
    // create default admin credentials if not exists
    const defaultUser = await User.findOne({ username: "gns3labadmin" });

    if (!defaultUser) {
      const saltRounds = 12;

      const hashedPassword = await bcrypt.hash("gns3labadmin", saltRounds);

      const defaultUserCredentials = {
        name: "Gns3 Lab Admin",
        email: "gns3labadmin@labadmin.net",
        username: "gns3labadmin",
        password: hashedPassword,
        role: "administrator",
      };

      await User.create(defaultUserCredentials);

      // initiate collections
      await Classroom.find({}).limit(1);
      await Projects.find({}).limit(1);
      console.log("Default admin credential created: ", {
        username: defaultUserCredentials.username,
        email: defaultUserCredentials.email,
        password: "gns3labadmin",
      });
    }
    // sync indexes for performance
    await User.syncIndexes();
    console.log("✅ MongoDB indexes synced");
  } catch (error) {
    console.log("❌", error);
    process.exit(1);
  }
};

export default MongoDB;

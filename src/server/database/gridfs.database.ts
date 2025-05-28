import mongoose from 'mongoose';
import {
  envMongoDBUsername,
  envMongoDBPassword,
  envMongoDBPort,
  envMongoDBHost,
  envMongoDBDbname
} from '@srvr/configs/env.config.js';
import { GridFsStorage } from 'multer-gridfs-storage';
import multer from 'multer';

const mongoURI = `mongodb://${envMongoDBUsername}:${envMongoDBPassword}@${envMongoDBHost}:${envMongoDBPort}/${envMongoDBDbname}?authSource=admin`;

// Create GridFS storage engine
// NOT TYPESAFE
const storage: any = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return {
      filename: file.originalname,
      bucketName: 'Gns3Bucket',
    };
  },
});

export const upload = multer({ storage });



const GridFileStorage = () => {
  let bucket: mongoose.mongo.GridFSBucket | null = null;

  mongoose.connection.on("connected", () => {
    const db = mongoose.connections[0].db; // Could be undefined

    if (db) {
      bucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: "Gns3Bucket"
      });
      console.log("✅ MongoDB Bucket created");
    } else {
      console.error("Database connection is undefined");
    }
  });
};

export default GridFileStorage;
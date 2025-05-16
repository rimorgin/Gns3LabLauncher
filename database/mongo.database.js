const mongoose = require('mongoose');
const User = require('../models/user.model')
const bcrypt = require('bcrypt');
const { envMongoDBUsername, envMongoDBPassword, envMongoDBHost, envMongoDBPort, envMongoDBDbname } = require('../configs/env.config');
const Classroom = require('../models/classroom.model');
const Projects = require('../models/projects.model');

const ConnectMongoDB = async () => {
  const uri = `mongodb://${envMongoDBUsername}:${envMongoDBPassword}@${envMongoDBHost}:${envMongoDBPort}/${envMongoDBDbname}?authSource=admin`;
  try {
    mongoose.set('strictQuery', false);
    mongoose.connect(uri);
    console.log(`MongoDB connected`);

    // create default admin credentials if not exists
    const defaultUser = await User.findOne({ username: 'gns3labadmin' });

    if (!defaultUser) {
      const saltRounds = 12;

      const hashedPassword = await bcrypt.hash('gns3labadmin', saltRounds);

      defaultUserCredentials = {
        name: 'Gns3 Lab Admin',
        email: 'gns3labadmin@labadmin.net',
        username: 'gns3labadmin',
        password: hashedPassword,
        role: 'administrator' 
      }
      
      await User.create(defaultUserCredentials);

      // initiate collections    
      await Classroom.find({}).limit(1);
      await Projects.find({}).limit(1);
      console.log('Default admin credential created: ', { 
        username: defaultUserCredentials.username,
        email: defaultUserCredentials.email, 
        password: 'gns3labadmin' 
      });
    }
    // sync indexes for performance
    await User.syncIndexes();
    console.log('MongoDB indexes synced');
  } catch (error) {
    console.log(error);
    process.exit(1)
  }

}

module.exports = ConnectMongoDB;

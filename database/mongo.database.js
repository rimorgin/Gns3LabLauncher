const mongoose = require('mongoose');
const User = require('../models/user.model')
const bcrypt = require('bcrypt');

const ConnectMongoDB = async () => {
  
  try {
    mongoose.set('strictQuery', false);
    mongoose.connect('mongodb://localhost:27017/gns3netlab');
    console.log(`MongoDB connected`);

    // create default admin credentials if not exists
    const defaultUser = await User.findOne({ username: 'gns3admin' });

    if (!defaultUser) {
      const saltRounds = 12;

      const hashedPassword = await bcrypt.hash('gns3admin', saltRounds);

      defaultUserCredentials = {
        name: 'gns3 lab admin',
        email: 'gns3admin@admin.net',
        username: 'gns3admin',
        password: hashedPassword,
        role: 'administrator' 
      }
      
      await User.create(defaultUserCredentials);
      console.log('Default admin credential created: ', { email: defaultUserCredentials.email, password: 'gns3admin' });
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

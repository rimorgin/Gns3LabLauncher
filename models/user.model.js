
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    default: 'Gns3 Labber'
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['administrator', 'instructor', 'student'],
    default: 'student'
  },
  classes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Classroom',
    default: function () {
      return this.role !== 'administrator' ? [] : undefined;
    }
  },
  is_online: {
    type: Boolean,
    default: function () {
      return this.role !== 'administrator' ? false : undefined;
    }
  },
  last_active_at: {
    type: Date,
    ddefault: function () {
      return this.role !== 'administrator' ? null : undefined;
    }
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

userSchema.methods.toJSON = function () {
  const user = this.toObject();

  // Hide sensitive fields
  delete user.password;
  delete user.__v;

  // Hide classes if administrator
  if (user.role === 'administrator') {
    delete user.classes;
  }

  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
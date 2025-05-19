import mongoose from 'mongoose'

const classroomSchema = new mongoose.Schema({
  coursecode: {
    type: String,
    required: true
  },
  classname: {
    type: String,
    required: true,
    unique: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  created_at: {
    type: Date,
    default: Date.now
  }
});

const Classroom = mongoose.model('Classroom', classroomSchema);

export default Classroom;
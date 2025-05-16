const mongoose = require('mongoose')

const projectsSchema = new mongoose.Schema({
  projectname: {
    type: String,
    required: true
  },
  classroom: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom',
  }],
  created_at: {
    type: Date,
    default: Date.now
  }
})

const Projects = mongoose.model('Projects', projectsSchema);

module.exports = Projects;
import mongoose from "mongoose";

const tasksSchema = new mongoose.Schema({
  coursecode: {
    type: String,
    required: true,
  },
  classname: {
    type: String,
    required: true,
    unique: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Tasks = mongoose.model("Projects", tasksSchema);

export default Tasks;
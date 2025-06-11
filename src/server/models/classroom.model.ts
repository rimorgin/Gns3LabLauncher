import { IClassroom } from "@srvr/types/models.type.ts";
import mongoose from "mongoose";

const classroomSchema = new mongoose.Schema({
  courseid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  classname: {
    type: String,
    required: true,
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
  status: {
    type: String,
    enum: ["active", "expired"],
    default: "active",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Classroom = mongoose.model<IClassroom>("Classroom", classroomSchema);

export default Classroom;

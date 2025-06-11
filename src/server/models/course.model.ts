import { ICourse } from "@srvr/types/models.type.ts";
import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  coursecode: {
    type: String,
    unique: true,
    required: true,
  },
  coursename: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Course = mongoose.model<ICourse>("Course", courseSchema);

export default Course;

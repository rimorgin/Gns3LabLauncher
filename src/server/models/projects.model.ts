import { IProject } from "@srvr/types/models.type.ts";
import mongoose from "mongoose";

const projectsSchema = new mongoose.Schema({
  projectname: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  classroom: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
    },
  ],
  visible: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Projects = mongoose.model<IProject>("Projects", projectsSchema);

export default Projects;

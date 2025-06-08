import { IGridFile, IGridFileModel } from "@srvr/types/gridfile.type.ts";
import schema from "@srvr/utils/gridfs.utils.ts";
import mongoose from "mongoose";

const GridFileStorage = mongoose.model<IGridFile, IGridFileModel>(
  "GridFileStorage",
  schema,
);

export default GridFileStorage;

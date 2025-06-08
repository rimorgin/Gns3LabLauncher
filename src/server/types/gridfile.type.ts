import {
  GridFSBucket,
  GridFSBucketReadStream,
  GridFSBucketWriteStream,
} from "mongodb";
import { Model, Document, Types } from "mongoose";

/**
 * Document instance (one GridFS file)
 */
export interface IGridFile extends Document {
  _id: Types.ObjectId;
  length?: number;
  chunkSize?: number;
  uploadDate?: Date;
  md5?: string;
  filename?: string;
  contentType?: string;
  metadata?: any;
  aliases?: string[];
  createdAt?: Date;
  chunkSizeBytes?: number;

  getUploadStream(): GridFSBucketWriteStream;
  getDownloadStream(): GridFSBucketReadStream;
  uploadStream(stream: NodeJS.ReadableStream): GridFSBucketWriteStream;
  downloadStream(stream: NodeJS.WritableStream): GridFSBucketReadStream;
  upload(stream: NodeJS.ReadableStream): Promise<IGridFile>;
  upload(
    stream: NodeJS.ReadableStream,
    callback: (err: Error | null, file: IGridFile) => void,
  ): void;
  download(stream: NodeJS.WritableStream): Promise<void>;
  download(
    stream: NodeJS.WritableStream,
    callback: (err: Error | null) => void,
  ): void;
}

/**
 * Model (fs.files collection)
 */
export interface IGridFileModel extends Model<IGridFile> {
  bucket?: GridFSBucket;
  getBucket(): GridFSBucket;
  findOneAndDeleteFile(query: object): Promise<IGridFile | null>;
  deleteById(id: string): Promise<IGridFile | null>;
}

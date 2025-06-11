import multer from "multer";
import { GridFSBucket } from "mongodb";
import { Request } from "express";
import GridFileStorage from "@srvr/models/gridfs.model.ts";

// Option 1: Custom Multer Storage Engine for GridFS
export default class GridFSStorageEngine implements multer.StorageEngine {
  private bucket: GridFSBucket;

  constructor() {
    this.bucket = GridFileStorage.getBucket();
  }

  _handleFile(
    req: Request,
    file: Express.Multer.File,
    callback: (error?: any, info?: Partial<Express.Multer.File>) => void,
  ): void {
    // Create new GridFile document
    const gridFile = new GridFileStorage({
      filename: file.originalname,
      contentType: file.mimetype,
      metadata: {
        uploadedBy: req.user?.id, // if you have user context
        uploadedAt: new Date(),
        originalName: file.originalname,
      },
    });

    // Get upload stream
    const uploadStream = gridFile.getUploadStream();

    // Handle upload completion
    uploadStream.on("finish", (uploadedFile: typeof gridFile) => {
      callback(null, {
        filename: uploadedFile.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: uploadedFile.length,
        // Store the GridFS file ID for later retrieval
        fieldname: file.fieldname,
        destination: uploadedFile._id.toString(),
      });
    });

    // Handle upload errors
    uploadStream.on("error", (error) => {
      callback(error);
    });

    // Pipe the file stream to GridFS
    file.stream.pipe(uploadStream);
  }

  _removeFile(
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null) => void,
  ): void {
    // Remove file from GridFS if needed
    if (file.destination) {
      GridFileStorage.deleteById(file.destination)
        .then(() => callback(null))
        .catch(callback);
    } else {
      callback(null);
    }
  }
}

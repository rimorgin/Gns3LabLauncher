import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { createReadStream, existsSync } from "fs";
import { Readable } from "stream";

class GridFileStorage {
  private bucket: mongoose.mongo.GridFSBucket | null = null;
  private isInitialized = false;
  private tempDir = path.join(process.cwd(), "temp-uploads");

  constructor() {
    this.initializeBucket();
    this.ensureTempDir();
  }

  private async ensureTempDir(): Promise<void> {
    try {
      if (!existsSync(this.tempDir)) {
        await fs.mkdir(this.tempDir, { recursive: true });
      }
    } catch (error) {
      console.error("Failed to create temp directory:", error);
    }
  }

  private initializeBucket(): void {
    if (mongoose.connection.readyState === 1) {
      this.createBucket();
    } else {
      mongoose.connection.once("connected", () => {
        this.createBucket();
      });
    }
  }

  private createBucket(): void {
    const db = mongoose.connection.db;
    if (db) {
      this.bucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: "Gns3Bucket",
      });
      this.isInitialized = true;
      console.log("✅ MongoDB GridFS Bucket created");
    } else {
      console.error("❌ Database connection is undefined");
    }
  }

  getBucket(): mongoose.mongo.GridFSBucket | null {
    return this.bucket;
  }

  isReady(): boolean {
    return this.isInitialized && this.bucket !== null;
  }

  // Upload from file path (disk storage)
  async uploadFromFile(
    filePath: string,
    filename: string,
    metadata?: any,
    deleteAfterUpload: boolean = true,
  ): Promise<mongoose.mongo.GridFSFile> {
    return new Promise((resolve, reject) => {
      if (!this.isReady()) {
        return reject(new Error("GridFS bucket not initialized"));
      }

      const uploadStream = this.bucket!.openUploadStream(filename, {
        metadata,
      });

      uploadStream.on("error", async (error) => {
        if (deleteAfterUpload) {
          try {
            await fs.unlink(filePath);
          } catch (unlinkError) {
            console.error("Failed to delete temp file:", unlinkError);
          }
        }
        reject(error);
      });

      uploadStream.on("finish", async (file: any) => {
        if (deleteAfterUpload) {
          try {
            await fs.unlink(filePath);
          } catch (unlinkError) {
            console.error("Failed to delete temp file:", unlinkError);
          }
        }
        resolve(file);
      });

      const readStream = createReadStream(filePath);
      readStream.pipe(uploadStream);
    });
  }

  // Upload from buffer (for small files only)
  async uploadFromBuffer(
    filename: string,
    buffer: Buffer,
    metadata?: any,
  ): Promise<mongoose.mongo.GridFSFile> {
    // Warn if buffer is large
    if (buffer.length > 5 * 1024 * 1024) {
      // 5MB
      console.warn(
        `⚠️ Uploading large file (${Math.round(buffer.length / 1024 / 1024)}MB) from memory`,
      );
    }

    return new Promise((resolve, reject) => {
      if (!this.isReady()) {
        return reject(new Error("GridFS bucket not initialized"));
      }

      const uploadStream = this.bucket!.openUploadStream(filename, {
        metadata,
      });

      uploadStream.on("error", reject);
      uploadStream.on("finish", (file: any) => {
        resolve(file);
      });

      const readableStream = new Readable();
      readableStream.push(buffer);
      readableStream.push(null);

      readableStream.pipe(uploadStream);
    });
  }

  // Upload from stream
  async uploadFromStream(
    filename: string,
    readableStream: Readable,
    metadata?: any,
  ): Promise<mongoose.mongo.GridFSFile> {
    return new Promise((resolve, reject) => {
      if (!this.isReady()) {
        return reject(new Error("GridFS bucket not initialized"));
      }

      const uploadStream = this.bucket!.openUploadStream(filename, {
        metadata,
      });

      uploadStream.on("error", reject);
      uploadStream.on("finish", (file: any) => {
        resolve(file);
      });

      readableStream.pipe(uploadStream);
    });
  }

  downloadById(
    fileId: string | mongoose.Types.ObjectId,
  ): mongoose.mongo.GridFSBucketReadStream {
    if (!this.isReady()) {
      throw new Error("GridFS bucket not initialized");
    }

    const objectId =
      typeof fileId === "string" ? new mongoose.Types.ObjectId(fileId) : fileId;

    return this.bucket!.openDownloadStream(objectId);
  }

  async deleteById(fileId: string | mongoose.Types.ObjectId): Promise<void> {
    if (!this.isReady()) {
      throw new Error("GridFS bucket not initialized");
    }

    const objectId =
      typeof fileId === "string" ? new mongoose.Types.ObjectId(fileId) : fileId;

    return this.bucket!.delete(objectId);
  }

  async getFileInfo(
    fileId: string | mongoose.Types.ObjectId,
  ): Promise<mongoose.mongo.GridFSFile | null> {
    if (!this.isReady()) {
      throw new Error("GridFS bucket not initialized");
    }

    const objectId =
      typeof fileId === "string" ? new mongoose.Types.ObjectId(fileId) : fileId;

    const files = await this.bucket!.find({ _id: objectId }).toArray();
    return files.length > 0 ? files[0] : null;
  }

  async findFiles(filter: any = {}): Promise<mongoose.mongo.GridFSFile[]> {
    if (!this.isReady()) {
      throw new Error("GridFS bucket not initialized");
    }

    return this.bucket!.find(filter).toArray();
  }
}

// Create singleton instance
const gridFileStorage = new GridFileStorage();

// Better multer configuration with disk storage
export const createGridFSMulter = (maxSize: number = 100 * 1024 * 1024) => {
  // 100MB default
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(process.cwd(), "uploads"));
    },
    filename: (req, file, cb) => {
      // Generate unique filename
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
      );
    },
  });

  return multer({
    storage,
    limits: {
      fileSize: maxSize,
      files: 10, // Max 10 files per request
    },
    fileFilter: (req, file, cb) => {
      // Add file type validation here if needed
      // For now, accept all files
      cb(null, true);
    },
  });
};

// Memory storage for small files only
export const createMemoryGridFSMulter = (maxSize: number = 5 * 1024 * 1024) => {
  // 5MB max
  const storage = multer.memoryStorage();

  return multer({
    storage,
    limits: {
      fileSize: maxSize,
      files: 5,
    },
  });
};

// Helper function to upload multer file from disk
export const uploadMulterFileToGridFS = async (
  file: Express.Multer.File,
  customFilename?: string,
  metadata?: any,
): Promise<mongoose.mongo.GridFSFile> => {
  const filename = customFilename || `${Date.now()}-${file.originalname}`;
  const fileMetadata = {
    originalName: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    uploadDate: new Date(),
    ...metadata,
  };

  // Check if file has a path (disk storage) or buffer (memory storage)
  if (file.path) {
    // Disk storage - upload from file path
    return gridFileStorage.uploadFromFile(
      file.path,
      filename,
      fileMetadata,
      true,
    );
  } else if (file.buffer) {
    // Memory storage - upload from buffer
    return gridFileStorage.uploadFromBuffer(
      filename,
      file.buffer,
      fileMetadata,
    );
  } else {
    throw new Error("Invalid file: no path or buffer found");
  }
};

export default gridFileStorage;

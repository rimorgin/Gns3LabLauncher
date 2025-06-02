import { Request, Response } from 'express';
import gridFileStorage, {
  uploadMulterFileToGridFS
} from '@srvr/database/gridfs.database.ts';

// Utility imports
import fs from 'fs/promises'
import path from 'path';

// Interface for chunked upload session tracking
interface ChunkUploadSession {
  filename: string;
  totalChunks: number;
  uploadedChunks: Set<number>;
  tempDir: string;
}

const uploadSessions = new Map<string, ChunkUploadSession>();

export const uploadLargeFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`📁 Received file: ${req.file.originalname} (${Math.round(req.file.size / 1024 / 1024)}MB)`);

    const uploadedFile = await uploadMulterFileToGridFS(
      req.file,
      undefined,
      { uploadedBy: req.user?.id }
    );

    return res.json({
      message: 'Large file uploaded successfully',
      fileId: uploadedFile._id,
      filename: uploadedFile.filename,
      size: uploadedFile.length
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    if (req.file?.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }
    }

    return res.status(500).json({ error: 'Failed to upload file' });
  }
};

export const uploadSmallFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`💾 Received small file: ${req.file.originalname} (${Math.round(req.file.size / 1024)}KB)`);

    const uploadedFile = await uploadMulterFileToGridFS(
      req.file,
      undefined,
      { uploadedBy: req.user?.id, category: 'thumbnail' }
    );

    return res.json({
      message: 'Small file uploaded successfully',
      fileId: uploadedFile._id,
      filename: uploadedFile.filename,
      size: uploadedFile.length
    });

  } catch (error) {
    console.error('Small file upload error:', error);
    return res.status(500).json({ error: 'Failed to upload file' });
  }
};

export const uploadStream = async (req: Request, res: Response) => {
  try {
    if (!req.headers['content-type']?.includes('multipart/form-data')) {
      const filename = req.headers['x-filename'] as string || `stream-${Date.now()}`;
      const contentType = req.headers['content-type'] || 'application/octet-stream';

      const uploadedFile = await gridFileStorage.uploadFromStream(
        filename,
        req,
        {
          mimetype: contentType,
          uploadDate: new Date(),
          uploadMethod: 'stream'
        }
      );

      return res.json({
        message: 'Stream uploaded successfully',
        fileId: uploadedFile._id,
        filename: uploadedFile.filename
      });
    }

    return res.status(400).json({ error: 'Invalid content type for stream upload' });
  } catch (error) {
    console.error('Stream upload error:', error);
    return res.status(500).json({ error: 'Failed to upload stream' });
  }
};

export const uploadChunk = async (req: Request, res: Response) => {
  try {
    const { sessionId, chunkIndex, totalChunks, filename } = req.query;

    if (!sessionId || !chunkIndex || !totalChunks || !filename) {
      return res.status(400).json({ error: 'Missing chunk upload parameters' });
    }

    const sessionKey = sessionId as string;
    const chunk = parseInt(chunkIndex as string);
    const total = parseInt(totalChunks as string);

    // Initialize session if needed
    if (!uploadSessions.has(sessionKey)) {
      uploadSessions.set(sessionKey, {
        filename: filename as string,
        totalChunks: total,
        uploadedChunks: new Set(),
        tempDir: `temp-chunks-${sessionKey}`
      });
    }

    const session = uploadSessions.get(sessionKey)!;

    // Save chunk to temp file
    const tempDir = path.join(process.cwd(), session.tempDir);
    await fs.mkdir(tempDir, { recursive: true });

    const chunkPath = path.join(tempDir, `chunk-${chunk}`);
    await fs.writeFile(chunkPath, req.body);

    session.uploadedChunks.add(chunk);

    // Check if all chunks are uploaded
    if (session.uploadedChunks.size === session.totalChunks) {
      const combinedFilePath = path.join(tempDir, 'combined');
      const writeStream = fs.createWriteStream(combinedFilePath);

      for (let i = 0; i < session.totalChunks; i++) {
        const chunkData = await fs.readFile(path.join(tempDir, `chunk-${i}`));
        writeStream.write(chunkData);
      }
      writeStream.end();

      await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });

      const uploadedFile = await gridFileStorage.uploadFromFile(
        combinedFilePath,
        session.filename,
        {
          uploadMethod: 'chunked',
          totalChunks: session.totalChunks,
          uploadDate: new Date()
        },
        false
      );

      await fs.rm(tempDir, { recursive: true, force: true });
      uploadSessions.delete(sessionKey);

      return res.json({
        message: 'Chunked upload completed',
        fileId: uploadedFile._id,
        filename: uploadedFile.filename,
        size: uploadedFile.length
      });
    }

    return res.json({
      message: `Chunk ${chunk + 1}/${total} uploaded`,
      uploadedChunks: session.uploadedChunks.size,
      totalChunks: session.totalChunks
    });

  } catch (error) {
    console.error('Chunk upload error:', error);
    return res.status(500).json({ error: 'Failed to upload chunk' });
  }
};

export const checkFileSize = async (req: Request, res: Response) => {
  try {
    const fileInfo = await gridFileStorage.getFileInfo(req.params.id);
    if (!fileInfo) {
      return res.status(404).json({ error: 'File not found' });
    }

    const sizeInMB = Math.round(fileInfo.length / 1024 / 1024 * 100) / 100;

    return res.json({
      id: fileInfo._id,
      filename: fileInfo.filename,
      sizeBytes: fileInfo.length,
      sizeMB: sizeInMB,
      uploadDate: fileInfo.uploadDate,
      metadata: fileInfo.metadata
    });
  } catch (error) {
    console.error('Size check error:', error);
    return res.status(500).json({ error: 'Failed to check file size' });
  }
};
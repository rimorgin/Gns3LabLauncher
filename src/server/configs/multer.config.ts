import GridFSStorageEngine from "@srvr/database/gridfs.database.ts";
import multer from "multer";

// Configure multer with custom GridFS storage
const upload = multer({
  storage: new GridFSStorageEngine(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, callback) => {
    // Add your file type validation here
    const allowedMimes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "text/plain",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error("Invalid file type"));
    }
  },
});

export default upload;

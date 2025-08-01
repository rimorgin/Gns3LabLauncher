import multer from "multer";
import path from "path";
import fs from "fs";
//import uuidv4 from "@srvr/utils/uuidv4.utils.ts";

const uploadDir = path.join(process.cwd(), "src/server/submissions");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "src/server/submissions/"),
  filename: (req, file, cb) => {
    // extract extension and base name
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);

    // final name (preserve extension)
    cb(null, `${baseName}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      const err = new Error("Only .png, .jpg and .jpeg format allowed!");
      err.name = "ExtensionError";
      return cb(err);
    }
  },
});

export default upload;

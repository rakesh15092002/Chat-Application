import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";

// Multer setup using memory storage (since we’ll upload directly to Cloudinary)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|docx|xlsx|txt/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowedTypes.test(ext) || allowedTypes.test(mime)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

export default upload;

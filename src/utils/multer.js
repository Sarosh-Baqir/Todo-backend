import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(__filename);

const uploadsDir = path.join(_dirname, "../public/uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Uploads directory created!");
} else {
  console.log("Uploads directory already exists!");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); // Corrected string interpolation
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid image format. Only JPEG, PNG, and GIF are allowed."),
      false
    );
  }
};

const upload = multer({ storage, fileFilter });
export default upload;

import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/products");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, filename);
  },
});

export const uploadProductImages = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).array("images", 5);

import path from "node:path";
import { randomUUID } from "node:crypto";

import multer from "multer";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.resolve("uploads", "avatars"));
  },
  filename: (_req, file, cb) => {
    const extname = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extname);
    const uuid = randomUUID();
    const filename = `${basename}.${uuid}${extname}`;

    cb(null, filename);
  },
});

export const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG and PNG images are allowed"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

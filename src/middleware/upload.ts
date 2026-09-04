// ==================================================
// SMC Trading Journal — Upload Middleware
// ==================================================

import multer from 'multer';
import { ValidationError } from './errorHandler';

const storage = multer.memoryStorage();

// Accept max 5MB images
export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new ValidationError('Invalid file type', ['Only image files are allowed.']));
    }
  }
});

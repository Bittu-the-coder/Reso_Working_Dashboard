const multer = require("multer");

// Configure multer for memory storage (files will be in buffer)
const storage = multer.memoryStorage();

// File filter to accept only certain file types
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("application/pdf") ||
    file.mimetype.startsWith("application/msword")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images, PDFs, and Word docs are allowed."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB file size limit
  }
});

module.exports = upload;
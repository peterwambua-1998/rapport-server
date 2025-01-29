const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure directories exist
const createDirectoryIfNotExists = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

// Create necessary directories for images and videos
createDirectoryIfNotExists("uploads/testimonial");

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype.startsWith("video/")) {
      cb(null, "uploads/testimonial/");
    } else {
      cb(new Error("Unsupported file type."));
    }
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// File filter for images and videos
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = [
    "video/mp4",
  ];

  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only MP4 videos are allowed."
      ),
      false
    );
  }
};

// Create multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 50MB limit for each file
  },
});

// Middleware for handling image and video uploads
const testimonialMiddleware = upload.fields([
  { name: "video", maxCount: 1 }, // Allows one file for video
]);

module.exports = testimonialMiddleware;

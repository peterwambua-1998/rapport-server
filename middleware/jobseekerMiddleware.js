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
createDirectoryIfNotExists("uploads/images");
createDirectoryIfNotExists("uploads/videos");

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, "uploads/images/");
    } else if (file.mimetype.startsWith("video/")) {
      cb(null, "uploads/videos/");
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
    "image/jpeg",
    "image/png",
    "image/gif",
    "video/mp4",
    "video/mpeg",
    "video/quicktime",
  ];

  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, GIF for images, and MP4, MPEG, and MOV for videos are allowed."
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
const uploadMediaMiddleware = upload.fields([
  { name: "profilePicture", maxCount: 1 }, // Allows one file for profile picture
  { name: "video", maxCount: 1 }, // Allows one file for video
]);

module.exports = uploadMediaMiddleware;

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the uploads directory exists
const uploadDirectory = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory); // Save files to the "uploads" directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Keep the original file extension
  },
});

// Initialize multer with storage configuration and limits
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const isValid =
      allowedTypes.test(file.mimetype) &&
      allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (isValid) {
      return cb(null, true); // Accept the file
    }
    cb(new Error("Error: Invalid file type!")); // Reject the file
  },
});

// Export the multer middleware
module.exports = upload; // Export the multer instance for use in other files

// const path = require('path');
// const multer = require('multer');

// // Configure Multer Storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(__dirname, '../uploads');
//     console.log('Saving files to:', uploadPath);
//     cb(null, uploadPath); // Set the file upload directory
//   },
//   filename: (req, file, cb) => {
//     const extname = path.extname(file.originalname);
//     const filename = `${file.fieldname}-${Date.now()}${extname}`;
//     console.log('Saving file as:', filename);
//     cb(null, filename); // Set the file name with a timestamp to avoid collisions
//   },
// });

// // File Filter for Images (JPEG, PNG, WEBP)
// const fileFilter = (req, file, cb) => {
//   const allowedFileTypes = /jpe?g|png|webp/;
//   const allowedMimeTypes = /image\/jpe?g|image\/png|image\/webp/;

//   const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedMimeTypes.test(file.mimetype);

//   if (extname && mimetype) {
//     cb(null, true); // Accept the file
//   } else {
//     cb(new Error('Only images (JPEG, PNG, WEBP) are allowed'), false); // Reject if file type is invalid
//   }
// };

// // Multer Upload Instance
// const upload = multer({
//   storage,
//   fileFilter,
// });

// // Export the upload instance for single image upload
// const uploadSingleImage = upload.single('image');

// module.exports = { uploadSingleImage };

// upload.js

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary"); // Make sure you have cloudinary.js configured

// Setup Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads", // Cloudinary folder name (you can change this!)
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, height: 800, crop: "limit" }], // Optional: auto-resize to limit dimensions
  },
});

// Multer instance using Cloudinary storage
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Optional: limit files to 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Only JPEG, PNG, and WEBP image formats are allowed!"),
        false
      );
    }
  },
});

// Export the single image upload middleware
const uploadSingleImage = upload.single("image");

module.exports = { uploadSingleImage };

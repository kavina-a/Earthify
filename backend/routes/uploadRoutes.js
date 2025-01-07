// const path = require("path");
// const express = require("express");
// const multer = require("multer");

// const router = express.Router();

// // Configure Multer Storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(__dirname, "../uploads");
//     console.log("Saving files to:", uploadPath);
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const extname = path.extname(file.originalname);
//     const filename = `${file.fieldname}-${Date.now()}${extname}`; 
//     console.log("Saving file as:", filename);
//     cb(null, filename);
//   },
// });

// // File Filter (Optional)
// const fileFilter = (req, file, cb) => {
//   const allowedFileTypes = /jpe?g|png|webp/;
//   const allowedMimeTypes = /image\/jpe?g|image\/png|image\/webp/;

//   const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedMimeTypes.test(file.mimetype);

//   if (extname && mimetype) {
//     cb(null, true); // Accept the file
//   } else {
//     cb(new Error("Only images (JPEG, PNG, WEBP) are allowed"), false); // Reject the file
//   }
// };

// // Multer Upload Instance
// const upload = multer({
//   storage,
//   fileFilter,
// });

// // Single Image Upload Middleware
// const uploadSingleImage = upload.single("image");

// // POST Route for Image Upload
// router.post("/", (req, res) => {
//   uploadSingleImage(req, res, (err) => {
//     if (err) {
//       console.error("Upload error:", err.message);
//       return res.status(400).send({ message: err.message });
//     }

//     if (req.file) {
//       console.log("Uploaded file:", req.file);
//       return res.status(200).send({
//         message: "Image uploaded successfully",
//         image: `/${req.file.path}`, // Path to the uploaded file
//       });
//     }

//     return res.status(400).send({ message: "No image file provided" });
//   });
// });

// module.exports = router;
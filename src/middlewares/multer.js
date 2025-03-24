const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); // specify the directory to save the file
  },
  filename: function (req, file, cb) {
    // Generate a unique filename to avoid overwriting files with the same name
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to the file name
  }
});

const upload = multer({
    storage: storage,
    // limits: { fileSize: 10 * 1024 * 1024 }, // Optional: Limit file size (e.g., 10MB)
    fileFilter: function (req, file, cb) {
      // Optional: Validate file type (e.g., only images)
      const fileTypes = /jpeg|jpg|png|gif/;
      const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = fileTypes.test(file.mimetype);
  
      if (extname && mimetype) {
        return cb(null, true); // Accept file
      } else {
        cb(new Error('Only image files are allowed!'), false); // Reject non-image files
      }
    }
  });

module.exports = upload; // Export the configured multer instance





// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './public/temp')
//       console.log("file details : " ,file)
//     },
//     filename: function (req, file, cb) {
//       console.log("file details : " ,file)
//       cb(null, file.originalname)
//     }
//   })
  
//    const upload = multer({ storage: storage })
  
//    module.exports = upload
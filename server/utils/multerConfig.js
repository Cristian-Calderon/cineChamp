// utils/multerConfig.js
const multer = require("multer");
const path = require("path");

// Carpeta real: PROJECT_ROOT/assets/uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(
      null,
      path.join(__dirname, "../assets/uploads")
    );
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

module.exports = upload;

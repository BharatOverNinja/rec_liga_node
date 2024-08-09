const multer = require("multer");
const path = require("path");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = path.join(__dirname, "../uploads/");

    if (file.fieldname === "main_image" || file.fieldname === "side_image") {
      uploadPath = path.join(uploadPath, "user_images");
    } else if (file.fieldname === "photo_answers") {
      uploadPath = path.join(uploadPath, "photo_answers");
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
});

module.exports = upload;

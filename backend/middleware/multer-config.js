const multer = require("multer");

const MINE_TYPE = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split("").join("_");
    const extansion = MINE_TYPE[file.mimetype];
    callback(null, name + Date.now() + "." + extansion);
  },
});

module.exports = multer({ storage }).single("image");

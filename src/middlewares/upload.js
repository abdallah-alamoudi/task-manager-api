const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();
const avatarMaxSize = 2; // in MB

const fileExtPattern = /\.(gif|jpe?g|png)$/i;
const fileFilter = (req, file, cb) => {
  const fileExt = path.extname(file.originalname);
  if (!fileExtPattern.test(fileExt)) {
    return cb(
      new Error("file must be an image of gif,jpe,jpeg or png extension")
    );
  }
  cb(null, true);
};

const upload = new multer({
  storage,
  limits: {
    fileSize: avatarMaxSize * 1024 * 1024,
  },
  fileFilter,
});
module.exports = upload;

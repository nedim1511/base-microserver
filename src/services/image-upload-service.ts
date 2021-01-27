const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const dotenv = require("dotenv");
dotenv.config();

aws.config.update({
  secretAccessKey: "DIKqvUSD6yBf9kaJYvuUtSCBIJzXFbCy1+h0PuDE",
  accessKeyId: "AKIATWJPFQWWLJZ3MF5W",
});

const s3 = new aws.S3();

// Just in case
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Only PNG and JPG are allowed."), false);
  }
};

const upload = multer({
  fileFilter: fileFilter,
  storage: multerS3({
    acl: "public-read",
    s3,
    bucket: "app.items.uploads",
    key: function (req, file, cb) {
      req.file = file.fieldname;
      cb(null, file.fieldname);
    },
  }),
});

module.exports = upload;

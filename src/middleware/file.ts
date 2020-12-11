import sharp from "sharp";
import multer from "multer";
import aws from 'aws-sdk';
import fs from "fs";
import multerS3 from "multer-s3";
import { v4 } from "uuid";

const s3 = new aws.S3({
  accessKeyId: 'AKIATWJPFQWWGUOV2FFV',
  secretAccessKey: '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',
  region: 'eu-central-1'
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
    }
}

export const uploadImages = multer({
    fileFilter,
    storage: multer.diskStorage({
        destination (req, file, cb) {
          cb(null, '/efs-images')
        },
        filename (req, file, cb) {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
          cb(null,uniqueSuffix + '-' + file.originalname)
        }
      }),
    limits: { fileSize: 200000000 }
});

export const resizeImages = async (req, res, next) => {
  if(!fs.existsSync('/efs-images/optimized')) {
    fs.mkdirSync('/efs-images/optimized');
  }
  if (!req.files) return next();

  req.body.images = [];
  await Promise.all(
    req.files.map(async file => {
      await sharp
      (file.path)
        .resize(null, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`/efs-images/optimized/${file.filename}`);
      req.body.images.push(file.filename);
    })
  );

  next();
};

export const uploadReport = multer({
  storage: multerS3({
      acl: 'public-read',
      s3,
      metadata (req, file, cb) {
          cb(null, { fieldName: file.fieldname });
      },
      bucket: 'report-generator-results',
      key (req, file, cb) {
          cb(null, v4() + ".docx");
      }
  }),
  limits: { fileSize: 2000000000 }
});

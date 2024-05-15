import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import multer from 'multer';
import config from '../app/config';
import { TImageRes } from '../app/interface/ImageResponseType';
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});
export const sendImageToCloudinary = (imgName: string, path: string):Promise<TImageRes> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path,
      function (error:Error, result:TImageRes) {
        if (error) {
          reject(error);
          fs.unlink(path, (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log('file is deleted');
            }
          });
        }
        resolve(result);
        fs.unlink(path, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log('file is deleted');
          }
        });
      },
    );
  });
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });

import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { isAuth, isAdmin } from '../middleware/authMiddleware.js';

const upload = multer();

const uploadRouter = express.Router();

uploadRouter.post(
  '/',
  isAuth,
  isAdmin,
  upload.single('file'),
  async (req, res) => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log('Cloudinary Config:', {
      message: 'The upload stream is working successfully!',
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    });
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

        stream.end(req.file.buffer);
      });
    };
    try {
      const result = await streamUpload(req);
      res.send(result);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
);

export default uploadRouter;

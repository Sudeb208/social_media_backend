import express from 'express';
import { createPost, deletePost, getPost } from '../Controller/postController';
import multer from 'multer';
import path from 'path';
import shortid from 'shortid';
import getLocation from '../middleware/locationMiddleware';
import { requireSignin } from '../middleware/CommonMiddleware';

const Storage = multer.diskStorage({
    destination(_req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), 'upload'));
    },
    filename(req, file, cb) {
        cb(null, `${shortid.generate()}-${file.originalname}`);
    },
});
const upload = multer({
    storage: Storage,
});

const router = express.Router();

router.post(
    '/create/post',
    requireSignin,
    // getLocation,
    upload.single('postPicture'),
    createPost,
);

router.get('/posts', getPost);

router.delete('/posts/delete', requireSignin, deletePost);

export default router;

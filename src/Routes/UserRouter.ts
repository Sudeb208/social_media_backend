import express from 'express';

const Router = express.Router();

import multer from 'multer';
import path from 'path';
import shortid from 'shortid';
import {
    createUser,
    loginUser,
    GoogleAuthentication,
} from '../Controller/userController';

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

Router.post('/user/account/create', upload.single('profileImage'), createUser);
Router.post('/user/account', loginUser);
Router.post('/user/account/verifiy/:user_id/:tokenid', loginUser);
Router.post('/user/account/login/google/oauth2', GoogleAuthentication);

export default Router;

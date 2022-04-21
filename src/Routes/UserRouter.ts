import express from 'express';

const Router = express.Router();

import multer from 'multer';
import path from 'path';
import shortid from 'shortid';
import {
    createUser,
    loginUser,
    GoogleAuthentication,
    verifiyToken,
    resendToken,
    changePassword,
    forgotPasswordRequest,
    isValidCode,
    signOut,
} from '../Controller/userController';
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

Router.post('/user/account/create', upload.single('profileImage'), createUser);
Router.post('/user/account', loginUser);
Router.post('/user/account/changepassword', changePassword);
Router.post('/user/account/forgotpassword/request', forgotPasswordRequest);
Router.post('/user/account/forgotpassword/:id', isValidCode);
Router.get('/user/account/verifiy/:user_id/:token', verifiyToken);
Router.get('/user/account/resend', resendToken);
Router.post('/user/account/login/google/oauth2', GoogleAuthentication);
Router.post('/user/account/logout', requireSignin, signOut);

export default Router;

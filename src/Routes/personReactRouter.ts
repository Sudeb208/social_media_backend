import express from 'express';
import {
    createPersonReact,
    getAllPersonReact,
    getPostReactInPersonReact,
} from '../Controller/personReactController';
import { requireSignin } from '../middleware/CommonMiddleware';

const Router = express.Router();

Router.post('/personreact/create', requireSignin, createPersonReact);
Router.get('/personreact/get', requireSignin, getAllPersonReact);
Router.post('/personreact/post/get', requireSignin, getPostReactInPersonReact);

export default Router;

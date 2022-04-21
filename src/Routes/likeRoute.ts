import express from 'express';
import {
    CountLike,
    getLikerPerson,
    postLike,
} from '../Controller/likeController';
import { requireSignin } from '../middleware/CommonMiddleware';

const Router = express.Router();

Router.post('/posts&comments/like', requireSignin, postLike);
Router.post('/post/react', CountLike);
Router.get('/post/reacter/person', getLikerPerson);

export default Router;

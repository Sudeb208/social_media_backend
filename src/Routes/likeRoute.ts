import express from 'express';
import {
    CountLike,
    getLikerPerson,
    postLike,
} from '../Controller/likeController';

const Router = express.Router();

Router.post('/posts&comments/like', postLike);
Router.get('/post/react', CountLike);
Router.get('/post/reacter/person', getLikerPerson);

export default Router;

import express from 'express';
import {
    createComment,
    deleteComment,
    getComment,
    replyComment,
    updateComment,
} from '../Controller/commentController';
import { requireSignin } from '../middleware/CommonMiddleware';

const Router = express.Router();

Router.post('/comment/create/new', requireSignin, createComment);
Router.post('/comment/post_id', getComment);
Router.post('/comment/reply/new', replyComment);
Router.post('/comment/update', updateComment);
Router.post('/comment/delete', deleteComment);

export default Router;

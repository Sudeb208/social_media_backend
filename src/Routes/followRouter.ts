import express from 'express';
import {
    createAndUpdateFollower,
    getFollower,
} from '../Controller/followController';

const Router = express.Router();

Router.post('/following', createAndUpdateFollower);
Router.get('/user/getfollower', getFollower);
export default Router;

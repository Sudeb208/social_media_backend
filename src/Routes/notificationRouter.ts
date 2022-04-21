import express from 'express';
import {
    createNotification,
    getNotification,
} from '../Controller/notificationController';

const Router = express.Router();

Router.post('/notification', createNotification);
Router.get('/notification/get', getNotification);

export default Router;

import express from 'express';
import mongoose from 'mongoose';
require('dotenv').config();
import cors from 'cors';

const App = express();

//middleware
App.use(express.json());
App.use(cors());

//router
import post from './Routes/postRouter';
import user from './Routes/UserRouter';
import comment from './Routes/commentRouter';
import react from './Routes/likeRoute';
import follower from './Routes/followRouter';
import notification from './Routes/notificationRouter';
import personReact from './Routes/personReactRouter';
import conversation from './Routes/conversationRoute';
import message from './Routes/messageRoute';

import path from 'path';

App.use('/public', express.static(path.join(__dirname, 'upload')));
App.use('/api', post);
App.use('/api', user);
App.use('/api', comment);
App.use('/api', react);
App.use('/api', follower);
App.use('/api', notification);
App.use('/api', personReact);
App.use('/api', conversation);
App.use('/api', message);

App.get('/', (req: any, res): void => {
    req.name = 'sudeb';
    res.status(200).json({
        name: 'sudeb',
    });
});

//conect to the mongo bd database
const URL: string | undefined = process.env.MONGOURL;

const option: any = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
};

(mongoose.connect as any)(URL, option)
    .then((res: any) => {
        console.log('mongo db conecttion successful');
    })
    .catch((e: string) => {
        console.log(e);
    });

//listening the port
const port: number = 4001;
App.listen(port, '192.168.43.247', (): void =>
    console.log('app runing in port ' + port),
);

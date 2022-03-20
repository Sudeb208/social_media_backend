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

App.use('/api', post);
App.use('/api', user);
App.use('/api', comment);
App.use('/api', react);
App.use('/api', follower);

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
App.listen(port, (): void => console.log('app runing in port ' + port));

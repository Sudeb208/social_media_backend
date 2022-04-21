import express from 'express';
import { createMessage, getMessage } from '../Controller/messageController';

const router = express.Router();

router.post('/message', createMessage);
router.get('/message', getMessage);

export default router;

import express from 'express';
import {
    createConversation,
    getConversation,
} from '../Controller/conversationController';

const router = express.Router();

router.post('/conversation', createConversation);
router.get('/conversation', getConversation);

export default router;

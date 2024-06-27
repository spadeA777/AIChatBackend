import express from 'express';

import {
    getAll,
    getChat,
    startChat
} from '@/controllers/chatController';

const router = express.Router();

router.post('/all', getAll);
router.post('/get', getChat);
router.post('/start', startChat);

export default router;

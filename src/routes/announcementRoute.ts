import express, { Router } from 'express';
import {
    createAnnouncement,
    getAnnouncement,
    deleteAnnouncement
} from '@/controllers/announcementController';

const router: Router = express.Router();

router.post('/create', createAnnouncement);
router.get('/get', getAnnouncement);
router.post('/delete', deleteAnnouncement);

export default router;

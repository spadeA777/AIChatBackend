import express from 'express';


import {
    connectWallet,
    getProfile,
    updateProfile
} from '@/controllers/authController';

const router = express.Router();

router.post('/connect', connectWallet);
router.post('/profile', getProfile);
router.post('/update', updateProfile);

export default router;

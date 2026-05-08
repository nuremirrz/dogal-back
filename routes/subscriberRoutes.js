import express from 'express';
import SubscriberController from '../controllers/SubscriberController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/subscribe', SubscriberController.subscribe);
router.post('/unsubscribe', SubscriberController.unsubscribe);

router.post('/send-newsletter', authMiddleware, SubscriberController.sendNewsletter);
router.get('/all', authMiddleware, SubscriberController.getAllSubscribers);

export default router;
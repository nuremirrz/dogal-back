import express from 'express';
import SubscriberController from '../controllers/SubscriberController.js';

const router = express.Router();

router.post('/subscribe', SubscriberController.subscribe);
router.post('/unsubscribe', SubscriberController.unsubscribe);
router.post('/send-newsletter', SubscriberController.sendNewsletter);
router.get('/all', SubscriberController.getAllSubscribers);

export default router;

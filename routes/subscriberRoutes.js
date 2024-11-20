import express from 'express';
import { subscribe, sendNewsletter } from '../controllers/SubscriberController.js';

const router = express.Router();

// Маршрут для подписки
router.post('/subscribe', subscribe);
// Маршрут для массовой рассылки
router.post('/send-newsletter', sendNewsletter);

export default router;

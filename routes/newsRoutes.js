import express from 'express';
import rateLimit from 'express-rate-limit';
import newsController from '../controllers/NewsControlller.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

const interactionLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Слишком много запросов. Попробуйте позже.' },
});

router.get('/', newsController.getAllNews);
router.get('/:id', newsController.getOneNews);
router.post('/:id/like', interactionLimiter, newsController.likeNews);
router.put('/:id/increment-views', interactionLimiter, newsController.incrementViews);
router.put('/:id/toggle-likes', interactionLimiter, newsController.toggleLikes);

router.post('/', authMiddleware, newsController.createNews);
router.put('/:id', authMiddleware, newsController.updateNews);
router.delete('/:id', authMiddleware, newsController.deleteNews);

export default router;
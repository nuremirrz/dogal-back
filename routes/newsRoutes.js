import express from "express"; 
import newsController from '../controllers/NewsControlller.js'

const router = express.Router();

router.get('/', newsController.getAllNews);
router.post('/', newsController.createNews);
router.get('/:id', newsController.getOneNews);
router.put('/:id', newsController.updateNews);
router.delete('/:id', newsController.deleteNews);
router.post('/:id/like', newsController.likeNews);
router.put('/:id/increment-views', newsController.incrementViews);
router.put('/:id/toggle-likes', newsController.toggleLikes);


export default router;
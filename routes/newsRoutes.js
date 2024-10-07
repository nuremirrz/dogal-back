import express from "express"; 
import newsController from '../controllers/NewsControlller.js'

const router = express.Router();

router.get('/', newsController.getAllNews);
router.post('/', newsController.createNews);
router.get('/:id', newsController.getOneNews);
router.put('/:id', newsController.updateNews);
router.delete('/:id', newsController.deleteNews);

export default router;
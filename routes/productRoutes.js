import express from 'express';
import productController from '../controllers/ProductController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { doubleCsrfProtection } from '../middlewares/csrf.js';

const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getOneProduct);

router.post('/', authMiddleware, doubleCsrfProtection, productController.createProduct);
router.put('/:id', authMiddleware, doubleCsrfProtection, productController.updateProduct);
router.delete('/:id', authMiddleware, doubleCsrfProtection, productController.deleteProduct);

export default router;
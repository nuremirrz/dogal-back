import express from 'express';
import employeeController from '../controllers/EmployeeController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { doubleCsrfProtection } from '../middlewares/csrf.js';

const router = express.Router();

router.get('/country/:country', employeeController.getEmployeesByCountryAndRegion);
router.get('/country/:country/region/:region', employeeController.getEmployeesByCountryAndRegion);

router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getOneEmployee);

router.post('/', authMiddleware, doubleCsrfProtection, employeeController.createEmployee);
router.put('/:id', authMiddleware, doubleCsrfProtection, employeeController.updateEmployee);
router.delete('/:id', authMiddleware, doubleCsrfProtection, employeeController.deleteEmployee);

export default router;
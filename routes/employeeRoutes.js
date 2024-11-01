import express from 'express';
import employeeController from '../controllers/EmployeeController.js';
import upload from '../middlewares/upload.js'

const router = express.Router();

router.get('/', employeeController.getAllEmployees);
router.post('/', upload.single('image'),  employeeController.createEmployee);
router.get('/:id', employeeController.getOneEmployee);
router.put('/:id', upload.single('image'),  employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

export default router;
import express from 'express';
import employeeController from '../controllers/EmployeeController.js';

const router = express.Router();

//new route for getting Employees by country, regions
router.get('/country/:country', employeeController.getEmployeesByCountryAndRegion);
router.get('/country/:country/region/:region', employeeController.getEmployeesByCountryAndRegion);

router.get('/', employeeController.getAllEmployees);
router.post('/', employeeController.createEmployee);
router.get('/:id', employeeController.getOneEmployee);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);


export default router;
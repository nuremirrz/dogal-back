import express from 'express';
import multer from 'multer';
import employeeController from '../controllers/EmployeeController.js';

const router = express.Router();

// Настройка Multer для загрузки изображений
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Папка для хранения изображений
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Уникальное имя файла
    },
});
const upload = multer({ storage });

// Маршруты
router.get('/', employeeController.getAllEmployees);
router.post('/', upload.single('image'), employeeController.createEmployee); // Добавлено использование multer
router.get('/:id', employeeController.getOneEmployee);
router.put('/:id', upload.single('image'), employeeController.updateEmployee); // Добавлено использование multer
router.delete('/:id', employeeController.deleteEmployee);

// Новые маршруты для сотрудников по стране и региону
router.get('/country/:country', employeeController.getEmployeesByCountryAndRegion);
router.get('/country/:country/region/:region?', employeeController.getEmployeesByCountryAndRegion);

export default router;
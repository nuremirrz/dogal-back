import express from 'express';
import cors from 'cors';
import path from 'path';
import { connectDB } from './db.js';
import productRoutes from './routes/productRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import subscriberRoutes from './routes/subscriberRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import multer from 'multer';

const app = express();
const PORT = process.env.PORT || 5000;

// Разрешить все запросы из любого источника
app.use(cors());

// Middleware для работы с JSON
app.use(express.json());

// Настройка Multer для загрузки изображений
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Папка для хранения файлов
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Папка для статических файлов (загруженные изображения)
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

// Роут для загрузки изображения
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Файл не был загружен' });
    }
    res.status(200).json({ imageUrl: `/uploads/${req.file.filename}` });
});

// Подключение маршрутов
app.use('/api/products', productRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/admin', adminRoutes);

// Главная страница
app.get('/', (req, res) => {
    res.send('Backend is running');
});

// Запуск сервера
async function startApp() {
    try {
        await connectDB();
        app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

startApp();

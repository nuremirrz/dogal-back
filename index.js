import express from 'express';
import cors from 'cors';
import path from 'path';
import { connectDB } from './db.js';
import productRoutes from './routes/productRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import subscriberRoutes from './routes/subscriberRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Разрешить все запросы из любого источника
app.use(cors());

// Middleware для работы с JSON
app.use(express.json());

// API маршруты
app.use('/api/products', productRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/admin', adminRoutes);

// Путь к статическим файлам
const __dirname = path.resolve();
const staticPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(staticPath));

// Обработка всех маршрутов, кроме API
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(staticPath, 'index.html'));
    }
});

// Запуск сервера
async function startApp() {
    try {
        connectDB(); // Подключение к базе данных
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

startApp();

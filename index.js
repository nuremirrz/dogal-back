import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import dotenv from 'dotenv';
import { connectDB, bootstrapAdminUser } from './db.js';
import productRoutes from './routes/productRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import subscriberRoutes from './routes/subscriberRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const REQUIRED_ENV = ['MONGODB_URL', 'JWT_SECRET'];
const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length) {
    console.error(`[fatal] отсутствуют обязательные переменные окружения: ${missing.join(', ')}`);
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(helmet());
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) return callback(null, true);
            return callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
    })
);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/products', productRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/admin', adminRoutes);

app.use('/api', (req, res) => {
    res.status(404).json({ message: 'API endpoint not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    if (err?.code === 'EBADCSRFTOKEN' || err?.code === 'ERR_CSRF_TOKEN_INVALID') {
        return res.status(403).json({ message: 'Недействительный CSRF-токен' });
    }
    if (err?.message === 'Not allowed by CORS') {
        return res.status(403).json({ message: 'Origin не разрешён' });
    }
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
});

const __dirname = path.resolve();
const staticPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(staticPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
});

async function startApp() {
    try {
        await connectDB();
        await bootstrapAdminUser();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Ошибка подключения к базе:', error.message);
        process.exit(1);
    }
}

startApp();
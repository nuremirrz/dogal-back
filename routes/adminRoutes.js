import express from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const adminUsername = process.env.ADMIN_USERNAME;
const adminPassword = process.env.ADMIN_PASSWORD;
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

// Ограничение на количество попыток входа
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 5, // максимум 5 попыток
    message: { message: 'Слишком много неудачных попыток входа. Попробуйте позже.' },
});

// Маршрут для логина
router.post('/login', loginLimiter, (req, res) => {
    try {
        const { username, password } = req.body;

        if (username === adminUsername && password === adminPassword) {
            const token = jwt.sign({ username, role: 'admin' }, jwtSecret, { expiresIn: '1h' });
            res.json({ token, expiresIn: '1h', role: 'admin' });
        } else {
            console.log(`Неудачная попытка входа: ${req.ip}, username: ${username}`);
            res.status(401).json({ message: 'Неверные учетные данные' });
        }
    } catch (error) {
        console.error('Ошибка:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});

export default router;

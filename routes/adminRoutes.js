import express from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import User from '../models/User.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '8h';

if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { message: 'Слишком много неудачных попыток входа. Попробуйте позже.' },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/login', loginLimiter, async (req, res) => {
    try {
        const username = typeof req.body?.username === 'string' ? req.body.username.trim().toLowerCase() : '';
        const password = typeof req.body?.password === 'string' ? req.body.password : '';

        if (!username || !password) {
            return res.status(400).json({ message: 'Введите логин и пароль' });
        }

        const user = await User.findOne({ username });
        const ok = user ? await user.comparePassword(password) : false;

        if (!ok) {
            console.log(`Неудачная попытка входа: ip=${req.ip}, username=${username}`);
            return res.status(401).json({ message: 'Неверные учетные данные' });
        }

        const token = jwt.sign(
            { sub: user._id.toString(), username: user.username, role: user.role },
            jwtSecret,
            { expiresIn: jwtExpiresIn }
        );

        res.json({ token, role: user.role, username: user.username, expiresIn: jwtExpiresIn });
    } catch (error) {
        console.error('Ошибка логина:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});

router.post('/logout', (req, res) => {
    res.json({ message: 'Logged out' });
});

router.get('/me', authMiddleware, (req, res) => {
    res.json({ username: req.user.username, role: req.user.role });
});

export default router;
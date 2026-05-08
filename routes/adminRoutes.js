import express from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import User from '../models/User.js';
import authMiddleware, { AUTH_COOKIE } from '../middlewares/authMiddleware.js';
import { generateCsrfToken, doubleCsrfProtection } from '../middlewares/csrf.js';

const router = express.Router();

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '8h';
const isProd = process.env.NODE_ENV === 'production';

if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

const parseExpiresInToMs = (value) => {
    if (typeof value === 'number') return value * 1000;
    const match = /^(\d+)\s*([smhd])?$/.exec(String(value).trim());
    if (!match) return 8 * 60 * 60 * 1000;
    const n = parseInt(match[1], 10);
    const unit = match[2] || 's';
    const multipliers = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
    return n * multipliers[unit];
};

const authCookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
    maxAge: parseExpiresInToMs(jwtExpiresIn),
};

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

        res.cookie(AUTH_COOKIE, token, authCookieOptions);
        res.json({ role: user.role, username: user.username, expiresIn: jwtExpiresIn });
    } catch (error) {
        console.error('Ошибка логина:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie(AUTH_COOKIE, { ...authCookieOptions, maxAge: undefined });
    res.json({ message: 'Logged out' });
});

router.get('/me', authMiddleware, (req, res) => {
    res.json({ username: req.user.username, role: req.user.role });
});

// CSRF-токен выдаётся только авторизованным — sessionIdentifier = req.user.sub.
router.get('/csrf-token', authMiddleware, (req, res) => {
    const token = generateCsrfToken(req, res);
    res.json({ csrfToken: token });
});

export default router;
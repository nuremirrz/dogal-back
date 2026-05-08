import jwt from 'jsonwebtoken';

export const AUTH_COOKIE = 'auth_token';

const extractToken = (req) => {
    const cookieToken = req.cookies?.[AUTH_COOKIE];
    if (cookieToken) return cookieToken;
    const header = req.headers.authorization;
    if (header && header.startsWith('Bearer ')) return header.slice(7);
    return null;
};

const authMiddleware = (req, res, next) => {
    const token = extractToken(req);

    if (!token) {
        return res.status(401).json({ message: 'Доступ запрещен' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Неверный токен' });
    }
};

export default authMiddleware;
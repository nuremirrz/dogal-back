import { doubleCsrf } from 'csrf-csrf';

const isProd = process.env.NODE_ENV === 'production';
const csrfSecret = process.env.CSRF_SECRET || process.env.JWT_SECRET;

if (!csrfSecret) {
    throw new Error('CSRF_SECRET (или JWT_SECRET как fallback) обязателен');
}

const {
    generateCsrfToken,
    doubleCsrfProtection,
} = doubleCsrf({
    getSecret: () => csrfSecret,
    // Применяется только после authMiddleware → req.user.sub всегда определён.
    getSessionIdentifier: (req) => req.user?.sub || '',
    cookieName: isProd ? '__Host-csrf-token' : 'csrf-token',
    cookieOptions: {
        sameSite: 'strict',
        secure: isProd,
        httpOnly: true,
        path: '/',
    },
    getCsrfTokenFromRequest: (req) => req.headers['x-csrf-token'],
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
});

export { generateCsrfToken, doubleCsrfProtection };
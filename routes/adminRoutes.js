import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

const adminUsername = 'admin';
const adminPassword = 'securepassword';
const jwtSecret = process.env.JWT_SECRET || 'default_secret_key';

// Маршрут для логина
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    if (username === adminUsername && password === adminPassword) {
      const token = jwt.sign({ username }, jwtSecret, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Неверные учетные данные' });
    }
  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

export default router;

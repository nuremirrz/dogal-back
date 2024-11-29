import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

const adminUsername = 'admin';
const adminPassword = 'securepassword';

// Маршрут для логина
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === adminUsername && password === adminPassword) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Неверные учетные данные' });
  }
});

// Пример защищенного маршрута
router.get('/dashboard', (req, res) => {
  res.json({ message: 'Добро пожаловать в админку!' });
});

export default router;

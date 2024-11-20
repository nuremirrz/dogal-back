import Subscriber from '../models/Subscriber.js';
import { sendEmail } from '../middlewares/mailer.js';

// Контроллер для подписки
export const subscribe = async (req, res) => {
    const { email } = req.body;

    try {
        // Проверяем, существует ли email в базе
        const existingSubscriber = await Subscriber.findOne({ email });
        if (existingSubscriber) {
            return res.status(400).json({ message: 'Вы уже подписаны!' });
        }

        // Сохраняем нового подписчика
        const subscriber = new Subscriber({ email });
        await subscriber.save();

        // Отправляем подтверждающее письмо
        await sendEmail(email, 'Подписка подтверждена', 'Спасибо за подписку на нашу рассылку!');

        res.status(201).json({ message: 'Вы успешно подписались на рассылку!' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера. Попробуйте позже.' });
    }
};

// Контроллер для массовой рассылки
export const sendNewsletter = async (req, res) => {
    const { subject, text } = req.body;

    try {
        // Получаем всех подписчиков
        const subscribers = await Subscriber.find();

        // Отправляем письмо каждому подписчику
        for (const subscriber of subscribers) {
            await sendEmail(subscriber.email, subject, text);
        }

        res.status(200).json({ message: 'Рассылка успешно завершена!' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера. Попробуйте позже.' });
    }
};

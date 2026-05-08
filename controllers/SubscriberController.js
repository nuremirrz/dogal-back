import Subscriber from "../models/Subscriber.js";
import { sendEmail } from "../middlewares/mailer.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const isValidEmail = (email) => typeof email === 'string' && EMAIL_REGEX.test(email) && email.length <= 254;

class SubscriberController {
    async getAllSubscribers(req, res) {
        try {
            const limit = Math.min(parseInt(req.query.limit, 10) || 100, 500);
            const skip = Math.max(parseInt(req.query.skip, 10) || 0, 0);
            const [subscribers, total] = await Promise.all([
                Subscriber.find({}, "email subscribedAt").sort({ subscribedAt: -1 }).skip(skip).limit(limit),
                Subscriber.countDocuments({}),
            ]);
            res.status(200).json({ items: subscribers, total, limit, skip });
        } catch (error) {
            res.status(500).json({ message: "Ошибка сервера. Попробуйте позже." });
        }
    }

    async subscribe(req, res) {
        const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';

        if (!isValidEmail(email)) {
            return res.status(400).json({ message: "Некорректный формат email!" });
        }

        try {
            const existingSubscriber = await Subscriber.findOne({ email });
            if (existingSubscriber) {
                return res.status(400).json({ message: "Вы уже подписаны!" });
            }

            const subscriber = new Subscriber({ email });
            await subscriber.save();

            try {
                await sendEmail(
                    email,
                    "Подписка подтверждена",
                    `Спасибо за подписку! \n Теперь вы будете получать наши новости.`
                );
            } catch (mailError) {
                console.error('Не удалось отправить письмо подтверждения:', mailError.message);
            }

            res.status(201).json({ message: "Вы успешно подписались на рассылку!" });
        } catch (error) {
            res.status(500).json({ message: "Ошибка сервера. Попробуйте позже." });
        }
    }

    async unsubscribe(req, res) {
        const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';

        if (!isValidEmail(email)) {
            return res.status(400).json({ message: "Некорректный формат email!" });
        }

        try {
            const deletedSubscriber = await Subscriber.findOneAndDelete({ email });

            if (!deletedSubscriber) {
                return res.status(404).json({ message: "Пользователь с таким email не найден." });
            }

            res.status(200).json({ message: "Вы успешно отписались от рассылки!" });
        } catch (error) {
            res.status(500).json({ message: "Ошибка сервера. Попробуйте позже." });
        }
    }

    async sendNewsletter(req, res) {
        const { subject, text } = req.body;

        if (typeof subject !== 'string' || !subject.trim() || typeof text !== 'string' || !text.trim()) {
            return res.status(400).json({ message: "Тема и текст обязательны." });
        }

        try {
            const subscribers = await Subscriber.find({}, "email");
            const results = await Promise.allSettled(
                subscribers.map((subscriber) => sendEmail(subscriber.email, subject, text))
            );

            const sent = results.filter((r) => r.status === 'fulfilled').length;
            const failed = results.length - sent;

            console.log(
                `[newsletter] sender=${req.user?.username || 'unknown'} sent=${sent} failed=${failed}`
            );

            res.status(200).json({
                message: "Рассылка завершена",
                sent,
                failed,
                total: results.length,
            });
        } catch (error) {
            res.status(500).json({ message: "Ошибка сервера. Попробуйте позже." });
        }
    }
}

export default new SubscriberController();
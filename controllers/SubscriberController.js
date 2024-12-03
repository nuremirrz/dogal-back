import Subscriber from "../models/Subscriber.js";
import { sendEmail } from "../middlewares/mailer.js";

class SubscriberController {
    async getAllSubscribers(req, res) {
        try {
            const subscribers = await Subscriber.find({}, "email subscribedAt");
            res.status(200).json(subscribers);
        } catch (error) {
            res.status(500).json({ message: "Ошибка сервера. Попробуйте позже." });
        }
    }

    async subscribe(req, res) {
        const { email } = req.body;

        const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Некорректный формат email!" });
        }

        try {
            const existingSubscriber = await Subscriber.findOne({ email });
            if (existingSubscriber) {
                return res.status(400).json({ message: "Вы уже подписаны!" });
            }

            const subscriber = new Subscriber({ email });
            await subscriber.save();

            await sendEmail(
                email,
                "Подписка подтверждена",
                `<h1>Спасибо за подписку!</h1><p>Теперь вы будете получать наши новости.</p>`
            );

            res.status(201).json({ message: "Вы успешно подписались на рассылку!" });
        } catch (error) {
            res.status(500).json({ message: "Ошибка сервера. Попробуйте позже." });
        }
    }

    async unsubscribe(req, res) {
        const { email } = req.body;

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

        try {
            const subscribers = await Subscriber.find();
            const emailPromises = subscribers.map(subscriber =>
                sendEmail(subscriber.email, subject, text)
            );

            await Promise.all(emailPromises);

            res.status(200).json({ message: "Рассылка успешно завершена!" });
        } catch (error) {
            res.status(500).json({ message: "Ошибка сервера. Попробуйте позже." });
        }
    }
}

export default new SubscriberController();

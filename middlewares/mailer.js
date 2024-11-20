import nodemailer from 'nodemailer';

// Настройка SMTP-сервера
const transporter = nodemailer.createTransport({
    service: 'gmail', // Используем Gmail (можно заменить на другой сервис)
    auth: {
        user: 'your-email@gmail.com', // Твой email
        pass: 'your-app-password',   // App Password (не обычный пароль, см. ниже)
    },
});

// Функция отправки email
export const sendEmail = async (recipient, subject, text) => {
    try {
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: recipient,
            subject: subject,
            text: text,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email отправлен: ${info.response}`);
    } catch (error) {
        console.error('Ошибка при отправке письма:', error);
    }
};

import nodemailer from 'nodemailer';

// Настройка SMTP-сервера
const transporter = nodemailer.createTransport({
    service: 'gmail', // Используем Gmail (можно заменить на другой сервис)
    auth: {
        user: process.env.EMAIL_USER, // Твой email
        pass: process.env.EMAIL_PASS,   // App Password (не обычный пароль, см. ниже)
    },
});

// Функция отправки email
export const sendEmail = async (recipient, subject, text) => {
    try {
        const mailOptions = {
            from: 'Догал Агрохимикаты и Пестициды <infodogaltrm23092017@gmail.com>',
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

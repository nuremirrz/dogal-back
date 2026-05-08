import nodemailer from 'nodemailer';

// Настройка SMTP-сервера
const transporter = nodemailer.createTransport({
    service: 'gmail', // Используем Gmail (можно заменить на другой сервис)
    auth: {
        user: process.env.EMAIL_USER, // Твой email
        pass: process.env.EMAIL_PASS,   // App Password (не обычный пароль, см. ниже)
    },
});

const FROM_NAME = process.env.EMAIL_FROM_NAME || 'Догал Агрохимикаты и Пестициды';

// Функция отправки email
export const sendEmail = async (recipient, subject, text) => {
    const fromAddress = process.env.EMAIL_USER;
    if (!fromAddress) {
        throw new Error('EMAIL_USER is not configured');
    }

    const mailOptions = {
        from: `${FROM_NAME} <${fromAddress}>`,
        to: recipient,
        subject: subject,
        text: text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email отправлен: ${info.response}`);
    return info;
};

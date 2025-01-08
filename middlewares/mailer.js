import nodemailer from 'nodemailer';

// Настройка SMTP-сервера
const transporter = nodemailer.createTransport({
    service: 'gmail', // Используем Gmail (можно заменить на другой сервис)
    auth: {
        user: 'infodogaltrm23092017@gmail.com', // Твой email
        pass: 'cdjx cccu yvnq pusa',   // App Password (не обычный пароль, см. ниже)
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

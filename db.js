import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export const bootstrapAdminUser = async () => {
    const username = process.env.ADMIN_USERNAME?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
        console.warn('[bootstrap] ADMIN_USERNAME / ADMIN_PASSWORD не заданы — админ не создан');
        return;
    }

    try {
        const passwordHash = await User.hashPassword(password);
        const result = await User.updateOne(
            { username },
            { $setOnInsert: { username, passwordHash, role: 'admin' } },
            { upsert: true }
        );
        if (result.upsertedCount > 0) {
            console.log(`[bootstrap] создан админ: ${username}`);
        }
    } catch (error) {
        if (error?.code === 11000) {
            return;
        }
        console.error('[bootstrap] ошибка создания админа:', error.message);
    }
};
import mongoose from 'mongoose';

const Subscriber = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    subscribedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Subscriber', Subscriber);

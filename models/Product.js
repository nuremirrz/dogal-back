import mongoose from 'mongoose';

const Product = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String }, // Ссылка на изображение продукта
}, {
    timestamps: true, // Добавит поля createdAt и updatedAt
});

export default mongoose.model('Product', Product);
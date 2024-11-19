import mongoose from 'mongoose';

const Product = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    aplicableCrops: [{type: String}],
    activeIngredients: [{type: String}],
    category: {type: String, enum: ['Гербициды','ПГР', 'Специальные Препараты', 'Инсектициды', 'Удобрения','Акарициды','Нематициды','Фунгициды','Моллюскоциды','Фумиганты'], required: true },
    price: { type: Number, required: true },
    image: { type: String }, 
}, {
    timestamps: true, 
});

export default mongoose.model('Product', Product);
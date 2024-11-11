import mongoose from 'mongoose';

const Product = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    type: [{ type: String, required: true }],
    dosage: {type: String, required: true },
    aplicableCrops: [{type: String}],
    activeIngredients: [{type: String}],
    safetyPrecautions: {type: String},
    expirationData: {type: Date},
    category: {type: String, enum: ['Гербициды','ПГР', 'Инсектициды', 'Акарициды','Нематициды','Фунгициды','Моллюскоциды','Фумиганты'], required: true },
    price: { type: Number, required: true },
    image: { type: String }, 
}, {
    timestamps: true, 
});

export default mongoose.model('Product', Product);
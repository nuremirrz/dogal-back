import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    position: { type: String, required: true },
    contact: { type: String, required: true },
    image: { type: String }, // Ссылка на изображение сотрудника
}, {
    timestamps: true,
});

export default mongoose.model('Employee', employeeSchema)
import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, enum: ['События', 'Объявления', 'Новости компании'], required: true },
    tags: [{ type: String }],
    published: { type: Boolean, default: false },
    publishedAt: { type: Date },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    lastModified: { type: Date, default: Date.now },
    version: { type: Number, default: 1 }
}, {
    timestamps: true
});

export default mongoose.model("News", newsSchema);

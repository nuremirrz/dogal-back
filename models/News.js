import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true}    
}, {
    timestamps: true,
})

export default mongoose.model("News", newsSchema);
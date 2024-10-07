import News from '../models/News.js';

class NewsController {
    async getAllNews(req, res) {
        try {
            const allNews = await News.find();
            res.json(allNews);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getOneNews(req, res) {
        try {
            const oneNews = await News.findById(req.params.id);
            if (!oneNews) return res.status(404).json({ message: 'Selected News not found' });
            res.json(oneNews);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async createNews(req, res) {
        const { title, content, image } = req.body;
        try {
            const news = new News({title, content, image });
            await news.save();
            res.status(201).json(news);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateNews(req, res) {
        try {
            const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!news) return res.status(404).json({ message: 'Selected News not found' });
            res.json(news);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteNews(req, res) {
        try {
            const news = await News.findByIdAndDelete(req.params.id);
            if (!news) return res.status(404).json({ message: 'News not found' });
            res.json({ message: 'News deleted' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new NewsController();

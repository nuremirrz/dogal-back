import mongoose from 'mongoose';
import News from '../models/News.js';

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const sanitizeTags = (raw) => {
    if (Array.isArray(raw)) {
        return raw
            .map((tag) => String(tag).trim().slice(0, 50))
            .filter(Boolean);
    }
    if (typeof raw === 'string') {
        return raw
            .split(',')
            .map((tag) => tag.trim().slice(0, 50))
            .filter(Boolean);
    }
    return [];
};

class NewsController {
    // Получить все новости
    async getAllNews(req, res) {
        const { showAll } = req.query;
        try {
            const query = showAll === 'true' ? {} : { published: true };
            const allNews = await News.find(query);
            res.json(allNews);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Получить одну новость
    async getOneNews(req, res) {
        try {
            if (!isValidId(req.params.id)) {
                return res.status(400).json({ message: 'Invalid news id' });
            }
            const oneNews = await News.findByIdAndUpdate(
                req.params.id,
                { $inc: { views: 1 } },
                { new: true }
            );
            if (!oneNews) return res.status(404).json({ message: 'Selected News not found' });
            res.json(oneNews);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Создать новость
    async createNews(req, res) {
        const { title, content, image, category, tags, published } = req.body;
        const tagsArray = sanitizeTags(tags);
        const publishedAt = published ? new Date() : null;

        try {
            const news = new News({
                title,
                content,
                image,
                category,
                tags: tagsArray,
                published,
                publishedAt,
            });

            await news.save();
            res.status(201).json(news);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Обновить новость
    async updateNews(req, res) {
        const { title, content, image, category, tags, published } = req.body;

        try {
            if (!isValidId(req.params.id)) {
                return res.status(400).json({ message: 'Invalid news id' });
            }
            const news = await News.findById(req.params.id);
            if (!news) return res.status(404).json({ message: 'Selected News not found' });

            if (title !== undefined) news.title = title;
            if (content !== undefined) news.content = content;
            if (image !== undefined) news.image = image;
            if (category !== undefined) news.category = category;
            if (tags !== undefined) news.tags = sanitizeTags(tags);
            if (published !== undefined) {
                news.published = published;
                news.publishedAt = published ? news.publishedAt || new Date() : null;
            }
            news.lastModified = new Date();

            await news.save();
            res.json(news);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Удалить новость
    async deleteNews(req, res) {
        try {
            if (!isValidId(req.params.id)) {
                return res.status(400).json({ message: 'Invalid news id' });
            }
            const news = await News.findByIdAndDelete(req.params.id);
            if (!news) return res.status(404).json({ message: 'News not found' });
            res.json({ message: 'News deleted' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Лайк новость
    async likeNews(req, res) {
        try {
            if (!isValidId(req.params.id)) {
                return res.status(400).json({ message: 'Invalid news id' });
            }
            const news = await News.findByIdAndUpdate(
                req.params.id,
                { $inc: { likes: 1 } },
                { new: true }
            );
            if (!news) return res.status(404).json({ message: 'Selected News not found' });
            res.json({ message: 'News liked', likes: news.likes });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Просмотры новостей
    async incrementViews(req, res) {
        try {
            if (!isValidId(req.params.id)) {
                return res.status(400).json({ message: 'Invalid news id' });
            }
            const news = await News.findByIdAndUpdate(
                req.params.id,
                { $inc: { views: 1 } },
                { new: true }
            );
            if (!news) return res.status(404).json({ message: 'News not found' });
            res.json(news);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Метод для управления количеством лайков
    async toggleLikes(req, res) {
        const { action } = req.body;
        try {
            if (!isValidId(req.params.id)) {
                return res.status(400).json({ message: 'Invalid news id' });
            }
            if (action !== 'increment' && action !== 'decrement') {
                return res.status(400).json({ message: 'Invalid action' });
            }

            const update = action === 'increment'
                ? { $inc: { likes: 1 } }
                : { $inc: { likes: -1 } };
            const filter = action === 'decrement'
                ? { _id: req.params.id, likes: { $gt: 0 } }
                : { _id: req.params.id };

            const news = await News.findOneAndUpdate(filter, update, { new: true });
            if (!news) {
                return res.status(404).json({ message: 'News not found or likes already at zero' });
            }
            res.json({ message: `Likes ${action}ed`, likes: news.likes });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new NewsController();
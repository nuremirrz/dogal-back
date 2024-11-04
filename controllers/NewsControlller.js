import News from '../models/News.js';

class NewsController {
    // Получить все новости
    async getAllNews(req, res) {
        try {
            const allNews = await News.find();
            res.json(allNews);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Получить одну новость
    async getOneNews(req, res) {
        try {
            const oneNews = await News.findById(req.params.id);
            if (!oneNews) return res.status(404).json({ message: 'Selected News not found' });
            
            // Увеличить счетчик просмотров
            oneNews.views += 1;
            await oneNews.save();

            res.json(oneNews);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Создать новость
    async createNews(req, res) {
        const { title, content, image, category, tags, published } = req.body;
        try {
            const publishedAt = published ? new Date() : null;
            const news = new News({
                title,
                content,
                image,
                category,
                tags,
                published,
                publishedAt
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
            const news = await News.findById(req.params.id);
            if (!news) return res.status(404).json({ message: 'Selected News not found' });

            // Обновляем поля
            news.title = title || news.title;
            news.content = content || news.content;
            news.image = image || news.image;
            news.category = category || news.category;
            news.tags = tags || news.tags;
            news.published = published !== undefined ? published : news.published;
            news.publishedAt = published ? news.publishedAt || new Date() : null;
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
            const news = await News.findById(req.params.id);
            if (!news) return res.status(404).json({ message: 'Selected News not found' });

            news.likes += 1;
            await news.save();
            res.json({ message: 'News liked', likes: news.likes });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Ппросмотры новостей
    async incrementViews(req, res) {
        try {
            const news = await News.findByIdAndUpdate(
                req.params.id,
                { $inc: { views: 1 } }, // Увеличиваем поле views на 1
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
        const { action } = req.body; // Получаем действие из тела запроса
        try {
            const news = await News.findById(req.params.id);
            if (!news) return res.status(404).json({ message: 'News not found' });

            if (action === 'increment') {
                news.likes += 1;
            } else if (action === 'decrement' && news.likes > 0) {
                news.likes -= 1;
            } else {
                return res.status(400).json({ message: 'Invalid action' });
            }

            await news.save();
            res.json({ message: `Likes ${action}ed`, likes: news.likes });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    
}

export default new NewsController();

import mongoose from 'mongoose';
import Product from '../models/Product.js';

const PRODUCT_FIELDS = ['name', 'description', 'aplicableCrops', 'activeIngredients', 'category', 'price', 'image'];

const pickProductFields = (body = {}) =>
    PRODUCT_FIELDS.reduce((acc, key) => {
        if (body[key] !== undefined) acc[key] = body[key];
        return acc;
    }, {});

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

class ProductController {
    async getAllProducts(req, res) {
        try {
            const products = await Product.find();
            res.json(products);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getOneProduct(req, res) {
        try {
            if (!isValidId(req.params.id)) {
                return res.status(400).json({ message: 'Invalid product id' });
            }
            const product = await Product.findById(req.params.id);
            if (!product) return res.status(404).json({ message: 'Product not found' });
            res.json(product);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async createProduct(req, res) {
        try {
            const data = pickProductFields(req.body);
            const product = new Product(data);
            await product.save();
            res.status(201).json(product);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateProduct(req, res) {
        try {
            if (!isValidId(req.params.id)) {
                return res.status(400).json({ message: 'Invalid product id' });
            }
            const updates = pickProductFields(req.body);
            const product = await Product.findByIdAndUpdate(req.params.id, updates, {
                new: true,
                runValidators: true,
            });
            if (!product) return res.status(404).json({ message: 'Product not found' });
            res.json(product);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            if (!isValidId(req.params.id)) {
                return res.status(400).json({ message: 'Invalid product id' });
            }
            const product = await Product.findByIdAndDelete(req.params.id);
            if (!product) return res.status(404).json({ message: 'Product not found' });
            res.json({ message: 'Product deleted' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new ProductController();
import express from 'express';
import cors from 'cors';
import {connectDB} from './db.js';
import productRoutes from './routes/productRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import newsRoutes from './routes/newsRoutes.js'


const app = express();
const PORT = process.env.PORT || 5000;

// Разрешить все запросы из любого источника
app.use(cors());

//Middleware для работы с JSON
app.use(express.json());

app.use('/api/products', productRoutes)
app.use('/api/employees', employeeRoutes)
app.use('/api/news', newsRoutes)

app.get('/', (req, res) => {
    res.send('Backend is running');
});

//testing API
app.get('/api/test', (req, res) => {
    res.json({ message: 'API работает!' });
});

async function startApp() {
    try {
        connectDB()
        //server activation
        app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

startApp();

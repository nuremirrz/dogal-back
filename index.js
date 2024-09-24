import express from 'express';
import {connectDB} from './db.js';
import productRoutes from './routes/productRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';


const app = express();
const PORT = process.env.PORT || 5000;

//Middleware для работы с JSON
app.use(express.json());

app.use('/api/products', productRoutes)
app.use('/api/employees', employeeRoutes)

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

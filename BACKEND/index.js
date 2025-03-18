import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import userRoute from './routes/user.js';
import categoryRoute from './routes/category.js';
import productRoute from './routes/product.js';
import billRoute from './routes/bill.js';
import dashboardRoute from './routes/dashboard.js';

const app = express();

// 📌 Configurar CORS con opciones (ajustar según necesidades)
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }));

// 📌 Middleware para registrar solicitudes
app.use(morgan('dev'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 📌 Definir rutas
app.use('/user', userRoute);
app.use('/category', categoryRoute);
app.use('/product', productRoute);
app.use('/bill', billRoute);
app.use('/dashboard', dashboardRoute);

// 📌 Ruta de prueba para verificar que el servidor funciona
app.get('/', (req, res) => {
    res.json({ message: 'API funcionando correctamente 🚀' });
});

export default app;

import express from "express";
import cors from 'cors';
import { sequelize, models } from './models/index.js';
import routes from './routes.js';
import errorHandler from '../src/_middleware/error-handler.js';
import { seedDatabase } from './config/database-seed.js';

const app = express();
const port = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());
app.use(routes);

sequelize.sync({ force:true, alter: true }).then(async() => {

}).catch((error) => {
    console.error('Erro ao sincronizar tabelas:', error);
});

app.use(errorHandler); // Manipulador de erro global (error handler)
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
import express from "express";
import cors from 'cors';
import { sequelize, models } from './models/index.js';
import routes from './routes.js';
import errorHandler from '../src/_middleware/error-handler.js';

const app = express();
const port = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());
app.use(routes);

sequelize.sync({ force: true, alter: true }).catch((error) => {
    console.error('Erro ao sincronizar tabelas:', error);
});

app.use(errorHandler); // Manipulador de erro global (error handler)
app.listen(port, async() => {
    console.log(`Servidor rodando na porta ${port}`);
});

// Ao iniciar o sistema, é necessário que pelo menos um endereço e um bairro estejam 
// cadastrados, pois o cliente possui uma associação direta com o endereço, que por 
// sua vez está vinculado a um bairro.
// Como não foi implementado um cadastro específico para endereços e bairros, tornou - se 
// necessário realizar esses cadastros iniciais manualmente para garantir o funcionamento correto 
// do relacionamento entre as entidades.
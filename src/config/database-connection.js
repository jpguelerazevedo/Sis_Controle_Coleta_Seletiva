import { sequelize, models } from '../models/index.js';

const syncDatabase = async () => {
    try {
        // Sincroniza os modelos com o banco
        await sequelize.sync({ force: true }); 
        // ⚠️ Atenção: force: true apaga e recria as tabelas. 
        // Use { alter: true } se quiser atualizar sem apagar dados.

        console.log('Database synchronized successfully');
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
};

syncDatabase();

export default sequelize;

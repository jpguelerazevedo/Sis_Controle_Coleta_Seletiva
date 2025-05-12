import { sequelize, models } from '../models/index.js';


const syncDatabase = async() => {
    try {
        
        await sequelize.query('PRAGMA foreign_keys = OFF;');

        
        await sequelize.sync({ force: true });

        await sequelize.query('PRAGMA foreign_keys = ON;');

        console.log('Database synchronized successfully');
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
};

syncDatabase();

export default sequelize;
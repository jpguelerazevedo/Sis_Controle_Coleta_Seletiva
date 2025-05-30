
// Configuração do banco de dados no ambiente de teste
// export const databaseConfig = {
//   dialect: 'sqlite',
//   storage: 'database.sqlite',
//   define: {
//     timestamps: true,
//     freezeTableName: true,
//     underscored: true
//   }
// };

export const databaseConfig = {
  dialect: 'postgres',
  host: 'dpg-d0sricadbo4c73fctvig-a.oregon-postgres.render.com',
  username: 'svc',
  password: 'KnYAepjwVwUWgRKT2PI1ZrMBDahJBbgs',
  database: 'svc_8rsd', // <-- Somente o nome do banco
  port: 5432, // Porta padrão do PostgreSQL na Render
  define: {
    timestamps: true,
    freezeTableName: true,
    underscored: true,
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Importante para conexão na Render que exige SSL
    }
  },
};



/*
// Configuração do banco de dados no ambiente de produção
export const databaseConfig = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'postgres',
  database: 'scv-backend-node-sequelize',
  define: {
    timestamps: true,
    freezeTableName: true,
    underscored: true
  }
};
*/

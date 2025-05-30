
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
  host: 'dpg-d0sricadbo4c73fctvig-a',
  username: 'svc',
  password: 'KnYAepjwVwUWgRKT2PI1ZrMBDahJBbgs',
  database: 'postgresql://svc:KnYAepjwVwUWgRKT2PI1ZrMBDahJBbgs@dpg-d0sricadbo4c73fctvig-a.oregon-postgres.render.com/svc_8rsd',
  define: {
    timestamps: true,
    freezeTableName: true,
    underscored: true
  }
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

import { Sequelize } from 'sequelize';
import { databaseConfig } from '../config/database-config.js';

import { Bairro } from './Bairro.js';
import { Endereco } from './Endereco.js';
import { Pessoa } from './Pessoa.js';
import { Cliente } from './Cliente.js';
import { Colaborador } from './Colaborador.js';
import { Cargo } from './Cargo.js';
import { Material } from './Material.js';
import { PedidoColeta } from './PedidoColeta.js';
import { RecebimentoMaterial } from './RecebimentoMaterial.js';
import { EnvioMaterial } from './EnvioMaterial.js';
import { Terceirizada } from './Terceirizada.js';

const sequelize = new Sequelize(databaseConfig);

// Initialize models
const models = {
  Bairro: Bairro.init(sequelize),
  Endereco: Endereco.init(sequelize),
  Pessoa: Pessoa.init(sequelize),
  Cliente: Cliente.init(sequelize),
  Colaborador: Colaborador.init(sequelize),
  Cargo: Cargo.init(sequelize),
  Material: Material.init(sequelize),
  PedidoColeta: PedidoColeta.init(sequelize),
  RecebimentoMaterial: RecebimentoMaterial.init(sequelize),
  EnvioMaterial: EnvioMaterial.init(sequelize),
  Terceirizada: Terceirizada.init(sequelize),
};

// Set up associations
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

export { sequelize };
export { models };

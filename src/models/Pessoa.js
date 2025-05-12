import { Model, DataTypes } from 'sequelize';

class Pessoa extends Model {
  static init(sequelize) {
    return super.init({
      cpf: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      telefone: {
        type: DataTypes.STRING,
        allowNull: false
      },
      sexo: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'pessoa',
      tableName: 'pessoas'
    });
  }

  static associate(models) {
    this.hasOne(models.Cliente, {
      foreignKey: 'cpf',
      as: 'cliente'
    });
    this.hasOne(models.Colaborador, {
      foreignKey: 'cpf',
      as: 'colaborador'
    });
  }
}

export { Pessoa };

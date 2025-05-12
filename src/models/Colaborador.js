import { Model, DataTypes } from 'sequelize';

class Colaborador extends Model {
  static init(sequelize) {
    return super.init({
      cpf: {
        type: DataTypes.STRING,
        primaryKey: true,
        references: {
          model: 'pessoas',
          key: 'cpf'
        }
      },
      dataAdmissao: {
        type: DataTypes.DATE,
        allowNull: false
      },
      carga_horaria: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      nacionalidade: {
        type: DataTypes.STRING,
        allowNull: false
      },
      id_cargo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'cargos',
          key: 'id_cargo'
        }
      }
    }, {
      sequelize,
      modelName: 'colaborador',
      tableName: 'colaboradores'
    });
  }

  static associate(models) {
    this.belongsTo(models.Pessoa, {
      foreignKey: 'cpf',
      as: 'pessoa'
    });
    this.belongsTo(models.Cargo, {
      foreignKey: 'id_cargo',
      as: 'cargos'
    });
  }
}

export { Colaborador };

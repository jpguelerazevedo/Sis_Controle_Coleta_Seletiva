import { Model, DataTypes } from 'sequelize';

class Cargo extends Model {
  static init(sequelize) {
    return super.init({
      idCargo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nomeCargo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
        },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      hierarquia: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      salario: {
        type: DataTypes.FLOAT,
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'cargo',
      tableName: 'cargos'
    });
  }

  static associate(models) {
    this.hasMany(models.Colaborador, {
      foreignKey: 'idCargo',
      as: 'colaboradores'
    });
  }
}

export { Cargo };

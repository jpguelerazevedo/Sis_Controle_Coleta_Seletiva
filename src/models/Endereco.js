import { Model, DataTypes } from 'sequelize';

class Endereco extends Model {
  static init(sequelize) {
    return super.init({
      id_endereco: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_endereco'
      },
      numero: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'numero'
      },
      rua: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'rua'
      },
      referencia: {
        type: DataTypes.STRING,
        field: 'referencia'
      },
      cep: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'cep'
      },
      id_bairro: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_bairro',
        references: {
          model: 'bairros',
          key: 'id_bairro'
        }
      }
    }, {
      sequelize,
      modelName: 'endereco',
      tableName: 'enderecos',
      underscored: true,
      
    });
  }

  static associate(models) {
    this.belongsTo(models.Bairro, {
      foreignKey: 'id_bairro',
      as: 'bairro'
    });
    this.hasOne(models.Cliente, {
      foreignKey: 'id_endereco',
      as: 'cliente'
    });
  }
}

export { Endereco };

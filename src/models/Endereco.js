import { Model, DataTypes } from 'sequelize';

class Endereco extends Model {
  static init(sequelize) {
    return super.init({
      id_endereco: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      numero: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      rua: {
        type: DataTypes.STRING,
        allowNull: false
      },
      referencia: {
        type: DataTypes.STRING
      },
      cep: {
        type: DataTypes.STRING,
        allowNull: false
      },
      id_bairro: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'bairros', // nome exato da tabela
          key: 'id_bairro'
        }
      }
    }, {
      sequelize,
      modelName: 'Endereco',
      tableName: 'enderecos',
      underscored: true
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

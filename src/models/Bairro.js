import { Model, DataTypes } from 'sequelize';

class Bairro extends Model {
  static init(sequelize) {
    return super.init({
      id_bairro: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_bairro'
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'nome'
      },
      distancia_sede: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'distancia_sede'
      },
      qnt_pessoas_cadastradas: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'qnt_pessoas_cadastradas'
      },
      estado_de_acesso: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'estado_de_acesso'
      }
    }, {
      sequelize,
      modelName: 'bairro',
      tableName: 'bairros',
      underscored: true
    });
  }

  static associate(models) {
    this.hasMany(models.Endereco, {
      foreignKey: 'id_bairro',
      as: 'enderecos'
    });
  }
}

export { Bairro };
import { Model, DataTypes } from 'sequelize';

class Cliente extends Model {
  static init(sequelize) {
    return super.init({
      cpf: {
        type: DataTypes.STRING,
        primaryKey: true,
        field: 'cpf',
        references: {
          model: 'pessoas',
          key: 'cpf'
        }
      },
      turno_preferido_de_coleta: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'turno_preferido_de_coleta'
      },
      status_cliente: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'status_cliente'
      },
      frequencia_de_pedidos: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'frequencia_de_pedidos'
      },
      id_endereco: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_endereco',
        references: {
          model: 'enderecos',
          key: 'id_endereco'
        }
      }
    }, {
      sequelize,
      modelName: 'cliente',
      tableName: 'clientes',
      underscored: true
    });
  }

  static associate(models) {
    this.belongsTo(models.Pessoa, {
      foreignKey: 'cpf',
      as: 'pessoa'
    });
    this.belongsTo(models.Endereco, {
      foreignKey: 'id_endereco',
      as: 'endereco'
    });
  }
}

export { Cliente };

import { Model, DataTypes } from 'sequelize';

class PedidoColeta extends Model {
    static init(sequelize) {
        return super.init({
            idPedido: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                field: 'id_pedido'
            },
            tipo: {
                type: DataTypes.STRING,
                allowNull: true // Permite null para evitar erro se não enviado
            },
            peso: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            volume: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            idMaterial: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'id_material',
                references: {
                    model: 'materiais',
                    key: 'id_material'
                }
            },
            cpfCliente: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'cpf_cliente',
                references: {
                    model: 'clientes',
                    key: 'cpf'
                }
            },
            cpfColaborador: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'cpf_colaborador',
                references: {
                    model: 'colaboradores',
                    key: 'cpf'
                }
            }
            // Removido o campo 'data'
        }, {
            sequelize,
            modelName: 'pedidoColeta',
            tableName: 'pedidos_coleta',
            timestamps: true,
            underscored: true
        });
    }

    static associate(models) {
        this.belongsTo(models.Material, {
            foreignKey: 'id_material',
            as: 'material'
        });
        this.belongsTo(models.Cliente, {
            foreignKey: 'cpf_cliente',
            as: 'cliente'
        });
        this.belongsTo(models.Colaborador, {
            foreignKey: 'cpf_colaborador',
            as: 'colaborador'
        });
    }
}

export { PedidoColeta };
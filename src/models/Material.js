import { Model, DataTypes } from 'sequelize';

class Material extends Model {
    static init(sequelize) {
        return super.init({
            idMaterial: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                field: 'id_material'
            },
            peso: {
                type: DataTypes.FLOAT,
                allowNull: false,
                field: 'peso'
            },
            volume: {
                type: DataTypes.FLOAT,
                allowNull: false,
                field: 'volume'
            },
            nome: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                field: 'nome'
            },
            nivelDeRisco: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'nivel_de_risco'
            }
        }, {
            sequelize,
            modelName: 'material',
            tableName: 'materiais',
            underscored: true
        });
    }

    static associate(models) {
        this.hasMany(models.PedidoColeta, {
            foreignKey: 'id_material',
            as: 'pedidosColeta'
        });
        this.hasMany(models.RecebimentoMaterial, {
            foreignKey: 'id_material',
            as: 'recebimentos'
        });
        this.hasMany(models.EnvioMaterial, {
            foreignKey: 'id_material',
            as: 'envios'
        });
    }
}

export { Material };
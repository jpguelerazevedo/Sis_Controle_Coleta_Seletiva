import { Model, DataTypes } from 'sequelize';

class EnvioMaterial extends Model {
    static init(sequelize) {
        return super.init({
            idEnvio: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                field: 'id_envio'
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
            cnpj: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: 'terceirizadas',
                    key: 'cnpj'
                }
            },
            pesoEnviado: {
                type: DataTypes.FLOAT,
                allowNull: false,
                field: 'peso_enviado'
            },
            volumeEnviado: {
                type: DataTypes.FLOAT,
                allowNull: false,
                field: 'volume_enviado'
            }
        }, {
            sequelize,
            modelName: 'envioMaterial',
            tableName: 'envios_material',
            underscored: true
        });
    }

    static associate(models) {
        this.belongsTo(models.Material, {
            foreignKey: 'id_material',
            as: 'material'
        });
        this.belongsTo(models.Terceirizada, {
            foreignKey: 'cnpj',
            as: 'terceirizada'
        });
    }
}

export { EnvioMaterial };
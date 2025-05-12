import { Model, DataTypes } from 'sequelize';

class RecebimentoMaterial extends Model {
    static init(sequelize) {
        return super.init({
            idRecebimento: {
                type: DataTypes.STRING,
                primaryKey: true
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
                references: {
                    model: 'materiais',
                    key: 'id_material'
                }
            },
            cpfColaborador: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: 'colaboradores',
                    key: 'cpf'
                }
            }
        }, {
            sequelize,
            modelName: 'recebimentoMaterial',
            tableName: 'recebimentos_material',
            underscored: true
        });
    }

    static associate(models) {
        this.belongsTo(models.Material, {
            foreignKey: 'id_material',
            as: 'material'
        });
        this.belongsTo(models.Colaborador, {
            foreignKey: 'cpf_colaborador',
            as: 'colaborador'
        });
    }
}

export { RecebimentoMaterial };
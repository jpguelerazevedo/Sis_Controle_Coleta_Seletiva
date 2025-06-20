import { Model, DataTypes } from 'sequelize';

class Terceirizada extends Model {
    static init(sequelize) {
        return super.init({
            cnpj: {
                type: DataTypes.STRING,
                primaryKey: true,
                field: 'cnpj'
            },
            nome: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'nome'
            },
            telefone: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'telefone'
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                field: 'email',
                validate: {
                    isEmail: true
                }
            },
            horarioDeFuncionamento: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'horario_de_funcionamento'
            },
            estado: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'ativo'
            }
        }, {
            sequelize,
            modelName: 'terceirizada',
            tableName: 'terceirizadas',
            underscored: true
        });
    }

    static associate(models) {
        this.hasMany(models.EnvioMaterial, {
            foreignKey: 'cnpj',
            as: 'envios'
        });
    }
}

export { Terceirizada };
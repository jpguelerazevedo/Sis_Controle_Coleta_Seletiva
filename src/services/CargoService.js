import { Cargo } from "../models/Cargo.js";
import { QueryTypes } from 'sequelize';
import sequelize from '../config/database-connection.js';
import { Op } from 'sequelize';

class CargoService {
    async findAll() {
        try {
            const cargos = await Cargo.findAll();
            return cargos;
        } catch (error) {
            throw new Error('Erro ao buscar cargos: ' + error.message);
        }
    }

    async findByPk(req) {
        const { id_cargo } = req.params;
        const obj = await Cargo.findByPk(id_cargo);
        if (!obj) throw new Error('Cargo não encontrado!');
        return obj;
    }

    async create(req) {
        const { nomeCargo, descricao, hierarquia, salario } = req.body;

        const t = await sequelize.transaction();
        try {
            const obj = await Cargo.create({
                nomeCargo,
                descricao,
                hierarquia,
                salario

            }, { transaction: t });

            await t.commit();
            return obj
        } catch (error) {
            await t.rollback();
            throw new Error("Erro ao criar cargo: " + error.message);
        }
    }

    async update(req) {
        const { id_cargo } = req.params;
        const { nomeCargo, descricao, hierarquia, salario } = req.body;

        console.log('Dados recebidos para atualização:', { nomeCargo, descricao, hierarquia, salario });

        // Validate required fields
        if (nomeCargo !== undefined && nomeCargo.trim() === '') {
            throw new Error('Nome do cargo não pode estar vazio');
        }
        if (descricao !== undefined && descricao.trim() === '') {
            throw new Error('Descrição não pode estar vazia');
        }
        if (hierarquia !== undefined && (isNaN(hierarquia) || hierarquia < 0)) {
            throw new Error('Hierarquia deve ser um número inteiro positivo');
        }
        if (salario !== undefined && (isNaN(salario) || salario <= 0)) {
            throw new Error('Salário deve ser um número positivo');
        }

        const obj = await Cargo.findByPk(id_cargo);
        if (!obj) throw new Error('Cargo não encontrado!');

        console.log('Cargo atual:', obj.toJSON());

        const t = await sequelize.transaction();
        try {
            // Only update fields that were provided
            const updateData = {};
            if (nomeCargo !== undefined) updateData.nomeCargo = nomeCargo;
            if (descricao !== undefined) updateData.descricao = descricao;
            if (hierarquia !== undefined) updateData.hierarquia = parseInt(hierarquia);
            if (salario !== undefined) updateData.salario = parseFloat(salario);

            console.log('Dados para atualização:', updateData);

            // Verifica se o nome já existe em outro cargo
            if (nomeCargo !== undefined && nomeCargo !== obj.nomeCargo) {
                const cargoExistente = await Cargo.findOne({
                    where: {
                        nomeCargo: nomeCargo,
                        idCargo: {
                            [Op.ne]: id_cargo
                        }
                    }
                });

            }

            Object.assign(obj, updateData);
            await obj.save({ transaction: t });
            await t.commit();
            return obj;
        } catch (error) {
            await t.rollback();
            console.error('Erro detalhado:', error);
            if (error.name === 'SequelizeValidationError') {
                throw new Error(`Erro de validação: ${error.errors.map(e => e.message).join(', ')}`);
            }
            throw new Error("Erro ao atualizar cargo: " + error.message);
        }
    }

    async delete(req) {
        try {
            const { id_cargo } = req.params;
            const cargo = await Cargo.findByPk(id_cargo);
            if (!cargo) {
                throw new Error('Cargo não encontrado.');
            }
            await cargo.destroy();
            return { message: 'Cargo deletado com sucesso.' };
        } catch (error) {
            throw new Error('Erro ao deletar cargo: ' + error.message);
        }
    }
}

export { CargoService };
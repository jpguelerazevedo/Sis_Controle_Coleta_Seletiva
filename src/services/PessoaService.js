import { Pessoa } from '../models/Pessoa.js';
import { Cliente } from '../models/Cliente.js';
import { Colaborador } from '../models/Colaborador.js';

class PessoaService {
    async findAll() {
        try {
            const pessoas = await Pessoa.findAll({
                include: [{
                        model: Cliente,
                        as: 'cliente',
                        required: false
                    },
                    {
                        model: Colaborador,
                        as: 'colaborador',
                        required: false
                    }
                ]
            });
            return pessoas;
        } catch (error) {
            throw new Error('Erro ao buscar pessoas: ' + error.message);
        }
    }

    async findByPk(cpf) {
        try {
            const pessoa = await Pessoa.findByPk(cpf, {
                include: [{
                        model: Cliente,
                        as: 'cliente',
                        required: false
                    },
                    {
                        model: Colaborador,
                        as: 'colaborador',
                        required: false
                    }
                ]
            });

            if (!pessoa) {
                throw new Error('Pessoa não encontrada.');
            }

            return pessoa;
        } catch (error) {
            throw new Error('Erro ao buscar pessoa: ' + error.message);
        }
    }

    async create(pessoaData) {
        try {
            // Verifica se já existe uma pessoa com o mesmo CPF
            const pessoaExistente = await Pessoa.findByPk(pessoaData.cpf);
            if (pessoaExistente) {
                throw new Error('Já existe uma pessoa cadastrada com este CPF.');
            }

            // Verifica se já existe uma pessoa com o mesmo email
            const emailExistente = await Pessoa.findOne({
                where: { email: pessoaData.email }
            });
            if (emailExistente) {
                throw new Error('Já existe uma pessoa cadastrada com este email.');
            }

            const pessoa = await Pessoa.create(pessoaData);
            return this.findByPk(pessoa.cpf);
        } catch (error) {
            throw new Error('Erro ao criar pessoa: ' + error.message);
        }
    }

    async update(cpf, pessoaData) {
        try {
            const pessoa = await Pessoa.findByPk(cpf);
            if (!pessoa) {
                throw new Error('Pessoa não encontrada.');
            }

            // Se estiver atualizando o email, verifica se já existe
            if (pessoaData.email && pessoaData.email !== pessoa.email) {
                const emailExistente = await Pessoa.findOne({
                    where: { email: pessoaData.email }
                });
                if (emailExistente) {
                    throw new Error('Já existe uma pessoa cadastrada com este email.');
                }
            }

            await pessoa.update(pessoaData);
            return this.findByPk(cpf);
        } catch (error) {
            throw new Error('Erro ao atualizar pessoa: ' + error.message);
        }
    }

    async delete(cpf) {
        try {
            const pessoa = await Pessoa.findByPk(cpf);
            if (!pessoa) {
                throw new Error('Pessoa não encontrada.');
            }

            // Verifica se a pessoa está associada a algum cliente
            const cliente = await Cliente.findOne({
                where: { cpf: cpf }
            });

            // Verifica se a pessoa está associada a algum colaborador
            const colaborador = await Colaborador.findOne({
                where: { cpf: cpf }
            });

            if (cliente || colaborador) {
                throw new Error('Não é possível deletar esta pessoa pois está associada a um cliente ou colaborador.');
            }

            await pessoa.destroy();
            return { message: 'Pessoa deletada com sucesso.' };
        } catch (error) {
            throw new Error('Erro ao deletar pessoa: ' + error.message);
        }
    }
}

export { PessoaService };
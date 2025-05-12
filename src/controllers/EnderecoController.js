import { models } from '../models/index.js';

export const EnderecoController = {
  async findAll(req, res) {
    try {
      const enderecos = await models.Endereco.findAll();
      res.json(enderecos);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar endereços', error });
    }
  },

  async findByPk(req, res) {
    try {
      const { id_endereco } = req.params;
      const endereco = await models.Endereco.findByPk(id_endereco);
      if (!endereco) return res.status(404).json({ message: 'Endereço não encontrado' });
      res.json(endereco);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar endereço', error });
    }
  },

  async create(req, res) {
    try {
      const novoEndereco = await models.Endereco.create(req.body);
      res.status(201).json(novoEndereco);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar endereço', error });
    }
  },

  async update(req, res) {
    try {
      const { id_endereco } = req.params;
      const endereco = await models.Endereco.findByPk(id_endereco);
      if (!endereco) return res.status(404).json({ message: 'Endereço não encontrado' });

      await endereco.update(req.body);
      res.json(endereco);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar endereço', error });
    }
  },

  async delete(req, res) {
    try {
      const { id_endereco } = req.params;
      const endereco = await models.Endereco.findByPk(id_endereco);
      if (!endereco) return res.status(404).json({ message: 'Endereço não encontrado' });

      await endereco.destroy();
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: 'Erro ao deletar endereço', error });
    }
  }
};

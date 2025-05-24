import express from "express";
import { Router } from 'express';

// Controllers
import { BairroController } from './controllers/BairroController.js';
import { ClienteController } from './controllers/ClienteController.js';
import { CargoController } from './controllers/CargoController.js';
import { ColaboradorController } from './controllers/ColaboradorController.js';
import { MaterialController } from './controllers/MaterialController.js';
import { TerceirizadaController } from './controllers/TerceirizadaController.js';
import { EnderecoController } from './controllers/EnderecoController.js';
import { PedidoColetaController } from './controllers/PedidoColetaController.js';
import { EnvioMaterialController } from './controllers/EnvioMaterialController.js';
import { RecebimentoMaterialController } from './controllers/RecebimentoMaterialController.js';
import ReportsController from './controllers/ReportsController.js';

const routes = Router();

// Instanciação dos controllers
const bairroController = new BairroController();
const clienteController = new ClienteController();
const cargoController = new CargoController();
const colaboradorController = new ColaboradorController();
const materialController = new MaterialController();
const terceirizadaController = new TerceirizadaController();
const enderecoController = new EnderecoController();
const pedidoColetaController = new PedidoColetaController();
const envioMaterialController = new EnvioMaterialController();
const recebimentoMaterialController = new RecebimentoMaterialController();

// Rotas de Gestão de Materiais
routes.get('/materiais', (req, res) => materialController.findAll(req, res));
routes.get('/materiais/:id_material', (req, res) => materialController.findByPk(req, res));
routes.post('/materiais', (req, res) => materialController.create(req, res));
routes.put('/materiais/:id_material', (req, res) => materialController.update(req, res));
routes.delete('/materiais/:id_material', (req, res) => materialController.delete(req, res));

// Rotas de Gestão de Coleta e Envio
routes.post('/pedidos-coleta', (req, res) => pedidoColetaController.create(req, res));
routes.get('/pedidos-coleta', (req, res) => pedidoColetaController.findAll(req, res));
routes.get('/pedidos-coleta/:idPedido', (req, res) => pedidoColetaController.findByPk(req, res));
routes.delete('/pedidos-coleta/:idPedido', (req, res) => pedidoColetaController.delete(req, res));

routes.post('/envios-material', (req, res) => envioMaterialController.create(req, res));
routes.get('/envios-material', (req, res) => envioMaterialController.findAll(req, res));
routes.get('/envios-material/:idEnvio', (req, res) => envioMaterialController.findByPk(req, res));
routes.delete('/envios-material/:idEnvio', (req, res) => envioMaterialController.delete(req, res));

routes.post('/recebimentos-material', (req, res) => recebimentoMaterialController.create(req, res));
routes.get('/recebimentos-material', (req, res) => recebimentoMaterialController.findAll(req, res));
routes.get('/recebimentos-material/:idRecebimento', (req, res) => recebimentoMaterialController.findOne(req, res));
routes.delete('/recebimentos-material/:idRecebimento', (req, res) => recebimentoMaterialController.delete(req, res));

// Rotas de Gestão de Localização
routes.get('/bairros', (req, res) => bairroController.findAll(req, res));
routes.get('/bairros/:id_bairro', (req, res) => bairroController.findByPk(req, res));
routes.post('/bairros', (req, res) => bairroController.create(req, res));
routes.put('/bairros/:id_bairro', (req, res) => bairroController.update(req, res));
routes.delete('/bairros/:id_bairro', (req, res) => bairroController.delete(req, res));

routes.get('/enderecos', (req, res) => enderecoController.findAll(req, res));
routes.get('/enderecos/:id_endereco', (req, res) => enderecoController.findByPk(req, res));
routes.post('/enderecos', (req, res) => enderecoController.create(req, res));
routes.put('/enderecos/:id_endereco', (req, res) => enderecoController.update(req, res));
routes.delete('/enderecos/:id_endereco', (req, res) => enderecoController.delete(req, res));

// Rotas de Gestão de Pessoas
routes.get('/clientes', (req, res) => clienteController.findAll(req, res));
routes.get('/clientes/:cpf', (req, res) => clienteController.findByPk(req, res));
routes.post('/clientes', (req, res) => clienteController.create(req, res));
routes.put('/clientes/:cpf', (req, res) => clienteController.update(req, res));
routes.delete('/clientes/:cpf', (req, res) => clienteController.delete(req, res));

routes.get('/colaboradores', (req, res) => colaboradorController.findAll(req, res));
routes.get('/colaboradores/:cpf', (req, res) => colaboradorController.findByPk(req, res));
routes.post('/colaboradores', (req, res) => colaboradorController.create(req, res));
routes.put('/colaboradores/:cpf', (req, res) => colaboradorController.update(req, res));
routes.delete('/colaboradores/:cpf', (req, res) => colaboradorController.delete(req, res));

routes.get('/cargos', (req, res) => cargoController.findAll(req, res));
routes.get('/cargos/:id_cargo', (req, res) => cargoController.findByPk(req, res));
routes.post('/cargos', (req, res) => cargoController.create(req, res));
routes.put('/cargos/:id_cargo', (req, res) => cargoController.update(req, res));
routes.delete('/cargos/:id_cargo', (req, res) => cargoController.delete(req, res));

// Rotas de Gestão de Terceirizadas
routes.get('/terceirizadas', (req, res) => terceirizadaController.findAll(req, res));
routes.get('/terceirizadas/:cnpj', (req, res) => terceirizadaController.findByPk(req, res));
routes.post('/terceirizadas', (req, res) => terceirizadaController.create(req, res));
routes.put('/terceirizadas/:cnpj', (req, res) => terceirizadaController.update(req, res));
routes.delete('/terceirizadas/:cnpj', (req, res) => terceirizadaController.delete(req, res));

// Rotas de Relatórios
routes.get('/relatorios/materiais-coletados', (req, res) => ReportsController.getCollectedMaterials(req, res));
routes.get('/relatorios/pedidos-por-bairro', (req, res) => ReportsController.getCollectionOrdersByNeighborhood(req, res));
routes.get('/relatorios/pedidos-coleta', (req, res) => ReportsController.getAllCollectionOrders(req, res));
routes.get('/relatorios/materiais-disponiveis/:depositoId', (req, res) => ReportsController.getAvailableMaterials(req, res));
routes.get('/relatorios/materiais-enviados', (req, res) => ReportsController.getSentMaterials(req, res));
routes.get('/relatorios/clientes-cadastrados', (req, res) => ReportsController.getRegisteredClients(req, res));

export default routes;
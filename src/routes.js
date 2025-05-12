import express from "express";
import { Router } from 'express';

import { BairroController } from './controllers/BairroController.js';
import { ClienteController } from './controllers/ClienteController.js';
import { CargoController } from './controllers/CargoController.js';
import { ColaboradorController } from './controllers/ColaboradorController.js';
import { MaterialController } from './controllers/MaterialController.js';
import { TercerizadaController } from './controllers/TercerizadaController.js';
import { EnderecoController } from './controllers/EnderecoController.js';
import { PedidoColetaController } from './controllers/PedidoColetaController.js';
import { EnvioMaterialController } from './controllers/EnvioMaterialController.js';
import { RecebimentoMaterialController } from './controllers/RecebimentoMaterialController.js';

const routes = Router();

const bairroController = BairroController;
const clienteController = ClienteController;
const cargoController = CargoController;
const colaboradorController = ColaboradorController;
const materialController = MaterialController;
const tercerizadaController = TercerizadaController;
const enderecoController = EnderecoController;
const pedidoColetaController = new PedidoColetaController();
const envioMaterialController = new EnvioMaterialController();
const recebimentoMaterialController = new RecebimentoMaterialController();


routes.get('/enderecos', enderecoController.findAll);
routes.get('/enderecos/:id_endereco', enderecoController.findByPk);
routes.post('/enderecos', enderecoController.create);
routes.put('/enderecos/:id_endereco', enderecoController.update);
routes.delete('/enderecos/:id_endereco', enderecoController.delete);


routes.post('/pedidos-coleta', pedidoColetaController.create.bind(pedidoColetaController));
routes.get('/pedidos-coleta', pedidoColetaController.findAll.bind(pedidoColetaController));
routes.get('/pedidos-coleta/:idPedido', pedidoColetaController.findByPk.bind(pedidoColetaController));


routes.post('/envios-material', envioMaterialController.create.bind(envioMaterialController));
routes.get('/envios-material', envioMaterialController.findAll.bind(envioMaterialController));
routes.get('/envios-material/:idEnvio', envioMaterialController.findByPk.bind(envioMaterialController));


routes.post('/recebimentos-material', recebimentoMaterialController.create.bind(recebimentoMaterialController));
routes.get('/recebimentos-material', recebimentoMaterialController.findAll.bind(recebimentoMaterialController));
routes.get('/recebimentos-material/:idRecebimento', recebimentoMaterialController.findByPk.bind(recebimentoMaterialController));


routes.get('/bairros', bairroController.findAll);
routes.get('/bairros/:id_bairro', bairroController.findByPk);
routes.post('/bairros', bairroController.create);
routes.put('/bairros/:id_bairro', bairroController.update);
routes.delete('/bairros/:id_bairro', bairroController.delete);

routes.get('/clientes', clienteController.findAll);
routes.get('/clientes/:cpf', clienteController.findByPk);
routes.post('/clientes', clienteController.create);
routes.put('/clientes/:cpf', clienteController.update);
routes.delete('/clientes/:cpf', clienteController.delete);

routes.get('/cargos', cargoController.findAll);
routes.get('/cargos/:id_cargo', cargoController.findByPk);
routes.post('/cargos', cargoController.create);
routes.put('/cargos/:id_cargo', cargoController.update);
routes.delete('/cargos/:id_cargo', cargoController.delete);

routes.get('/colaboradores', colaboradorController.findAll);
routes.get('/colaboradores/:cpf', colaboradorController.findByPk);
routes.post('/colaboradores', colaboradorController.create);
routes.put('/colaboradores/:cpf', colaboradorController.update);
routes.delete('/colaboradores/:cpf', colaboradorController.delete);

routes.get('/materiais', materialController.findAll);
routes.get('/materiais/:id_material', materialController.findByPk);
routes.post('/materiais', materialController.create);
routes.put('/materiais/:id_material', materialController.update);
routes.delete('/materiais/:id_material', materialController.delete);

routes.get('/terceirizadas', tercerizadaController.findAll);
routes.get('/terceirizadas/:cnpj', tercerizadaController.findByPk);
routes.post('/terceirizadas', tercerizadaController.create);
routes.put('/terceirizadas/:cnpj', tercerizadaController.update);
routes.delete('/terceirizadas/:cnpj', tercerizadaController.delete);

export default routes ;
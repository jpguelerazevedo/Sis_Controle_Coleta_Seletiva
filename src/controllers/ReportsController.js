import Reports from '../reportService/reports.js';

class ReportsController {
    // 1. Listar materiais coletados por data
    async getCollectedMaterials(req, res) {
        try {
            let { startDate, endDate } = req.query;

            // Se não forem fornecidas datas, usa o mês atual
            if (!startDate || !endDate) {
                const today = new Date();
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
            } else {
                // Converte as strings de data para objetos Date
                startDate = new Date(startDate);
                endDate = new Date(endDate);
                endDate.setHours(23, 59, 59, 999);
            }

            // Validação das datas
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return res.status(400).json({ error: 'Datas inválidas. Use o formato YYYY-MM-DD' });
            }

            if (startDate > endDate) {
                return res.status(400).json({ error: 'Data inicial não pode ser maior que a data final' });
            }

            const materials = await Reports.getCollectedMaterials(startDate, endDate);

            if (!materials || materials.length === 0) {
                return res.status(200).json({
                    message: 'Nenhum material coletado encontrado no período especificado',
                    materials: []
                });
            }

            return res.json({
                message: `${materials.length} materiais coletados encontrados`,
                materials
            });
        } catch (error) {
            console.error('Erro ao buscar materiais coletados:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    // 2. Quantitativo de pedidos por bairro
    async getCollectionOrdersByNeighborhood(req, res) {
        try {
            let { startDate, endDate } = req.query;

            // Se não forem fornecidas datas, usa o mês atual
            if (!startDate || !endDate) {
                const today = new Date();
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
            } else {
                // Converte as strings de data para objetos Date
                startDate = new Date(startDate);
                endDate = new Date(endDate);
                endDate.setHours(23, 59, 59, 999);
            }

            // Validação das datas
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return res.status(400).json({ error: 'Datas inválidas. Use o formato YYYY-MM-DD' });
            }

            if (startDate > endDate) {
                return res.status(400).json({ error: 'Data inicial não pode ser maior que a data final' });
            }

            const orders = await Reports.getCollectionOrdersByNeighborhood(startDate, endDate);

            if (!orders || orders.length === 0) {
                return res.status(200).json({
                    message: 'Nenhum pedido encontrado no período especificado',
                    orders: []
                });
            }

            return res.json({
                message: `${orders.length} bairros com pedidos encontrados`,
                orders
            });
        } catch (error) {
            console.error('Erro ao buscar pedidos por bairro:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    // 3. Listar todos os pedidos de coleta
    async getAllCollectionOrders(req, res) {
        try {
            let { startDate, endDate } = req.query;
            // Se não forem fornecidas datas, usa o mês atual
            if (!startDate || !endDate) {
                const today = new Date();
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
            } else {
                // Converte as strings de data para objetos Date
                startDate = new Date(startDate);
                endDate = new Date(endDate);
                endDate.setHours(23, 59, 59, 999);
            }
            // Validação das datas
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return res.status(400).json({ error: 'Datas inválidas. Use o formato YYYY-MM-DD' });
            }

            if (startDate > endDate) {
                return res.status(400).json({ error: 'Data inicial não pode ser maior que a data final' });
            }
            const orders = await Reports.getAllCollectionOrders(startDate, endDate);

            if (!orders || orders.length === 0) {
                return res.status(200).json({
                    message: 'Nenhum pedido encontrado no período especificado',
                    orders: []
                });
            }

            return res.json({
                message: `${orders.length} pedidos encontrados`,
                orders
            });



        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // 4. Listar materiais disponíveis no depósito
    async getAvailableMaterials(req, res) {
        try {
            const { depositoId } = req.params;
            const materials = await Reports.getAvailableMaterials(depositoId);
            return res.json(materials);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // 5. Listar materiais enviados
    async getSentMaterials(req, res) {
        try {
            let { startDate, endDate, materialType } = req.query;

            // Se não forem fornecidas datas, usa o mês atual
            if (!startDate || !endDate) {
                const today = new Date();
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
            } else {
                // Converte as strings de data para objetos Date
                startDate = new Date(startDate);
                endDate = new Date(endDate);
                endDate.setHours(23, 59, 59, 999);
            }

            // Validação das datas
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return res.status(400).json({ error: 'Datas inválidas. Use o formato YYYY-MM-DD' });
            }

            if (startDate > endDate) {
                return res.status(400).json({ error: 'Data inicial não pode ser maior que a data final' });
            }

            const materials = await Reports.getSentMaterials(startDate, endDate, materialType);

            if (!materials || materials.length === 0) {
                return res.status(200).json({
                    message: 'Nenhum material enviado encontrado no período especificado',
                    materials: []
                });
            }

            return res.json({
                message: `${materials.length} materiais enviados encontrados`,
                materials
            });
        } catch (error) {
            console.error('Erro ao buscar materiais enviados:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    // 6. Listar clientes cadastrados
    async getRegisteredClients(req, res) {
        try {
            let { startDate, endDate } = req.query;

            // Se não forem fornecidas datas, usa o mês atual
            if (!startDate || !endDate) {
                const today = new Date();
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
            } else {
                // Converte as strings de data para objetos Date
                startDate = new Date(startDate);
                endDate = new Date(endDate);
                endDate.setHours(23, 59, 59, 999);
            }

            // Validação das datas
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return res.status(400).json({ error: 'Datas inválidas. Use o formato YYYY-MM-DD' });
            }

            if (startDate > endDate) {
                return res.status(400).json({ error: 'Data inicial não pode ser maior que a data final' });
            }

            const clients = await Reports.getRegisteredClients(startDate, endDate);

            if (!clients || clients.length === 0) {
                return res.status(200).json({
                    message: 'Nenhum cliente cadastrado encontrado no período especificado',
                    clients: []
                });
            }

            return res.json({
                message: `${clients.length} clientes cadastrados encontrados`,
                clients
            });
        } catch (error) {
            console.error('Erro ao buscar clientes cadastrados:', error);
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new ReportsController();
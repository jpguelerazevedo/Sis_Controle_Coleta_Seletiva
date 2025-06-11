import axios from 'axios';

const api = axios.create({
    baseURL: 'https://scv-w0i2.onrender.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

// API endpoints
export const endpoints = {
    // Clientes
    clientes: {
        list: () => api.get('/clientes'),
        get: (id) => api.get(`/clientes/${id}`),
        create: (data) => api.post('/clientes', data),
        update: (id, data) => api.put(`/clientes/${id}`, data),
        delete: (id) => api.delete(`/clientes/${id}`),
    },

    // Materiais
    materiais: {
        list: () => api.get('/materiais'),
        get: (id) => api.get(`/materiais/${id}`),
        create: (data) => api.post('/materiais', data),
        update: (id, data) => api.put(`/materiais/${id}`, data),
        delete: (id) => api.delete(`/materiais/${id}`),
    },

    // Pedidos de Coleta
    pedidosColeta: {
        list: () => api.get('/pedidos-coleta'),
        get: (id) => api.get(`/pedidos-coleta/${id}`),
        create: (data) => api.post('/pedidos-coleta', data),
        update: (id, data) => api.put(`/pedidos-coleta/${id}`, data),
        delete: (id) => api.delete(`/pedidos-coleta/${id}`),
    },

    // Colaboradores
    colaboradores: {
        list: () => api.get('/colaboradores'),
        get: (id) => api.get(`/colaboradores/${id}`),
        create: (data) => api.post('/colaboradores', data),
        update: (id, data) => api.put(`/colaboradores/${id}`, data),
        delete: (id) => api.delete(`/colaboradores/${id}`),
    },

    // Terceirizadas
    terceirizadas: {
        list: () => api.get('/terceirizadas'),
        get: (id) => api.get(`/terceirizadas/${id}`),
        create: (data) => api.post('/terceirizadas', data),
        update: (id, data) => api.put(`/terceirizadas/${id}`, data),
        delete: (id) => api.delete(`/terceirizadas/${id}`),
    },

    // Bairros
    bairros: {
        list: () => api.get('/bairros'),
        get: (id) => api.get(`/bairros/${id}`),
        create: (data) => api.post('/bairros', data),
        update: (id, data) => api.put(`/bairros/${id}`, data),
        delete: (id) => api.delete(`/bairros/${id}`),
    },

    // Cargos
    cargos: {
        list: () => api.get('/cargos'),
        get: (id) => api.get(`/cargos/${id}`),
        create: (data) => api.post('/cargos', data),
        update: (id, data) => api.put(`/cargos/${id}`, data),
        delete: (id) => api.delete(`/cargos/${id}`),
    },

    // Enderecos
    enderecos: {
        list: () => api.get('/enderecos'),
        get: (id) => api.get(`/enderecos/${id}`),
        create: (data) => api.post('/enderecos', data),
        update: (id, data) => api.put(`/enderecos/${id}`, data),
        delete: (id) => api.delete(`/enderecos/${id}`),
    },

    // Envios de Material
    enviosMaterial: {
        list: () => api.get('/envios-material'),
        get: (id) => api.get(`/envios-material/${id}`),
        create: (data) => api.post('/envios-material', data),
        update: (id, data) => api.put(`/envios-material/${id}`, data),
        delete: (id) => api.delete(`/envios-material/${id}`),
    },

    // Pessoas
    pessoas: {
        list: () => api.get('/pessoas'),
        get: (id) => api.get(`/pessoas/${id}`),
        create: (data) => api.post('/pessoas', data),
        update: (id, data) => api.put(`/pessoas/${id}`, data),
        delete: (id) => api.delete(`/pessoas/${id}`),
    },

    // Recebimentos de Material
    recebimentosMaterial: {
        list: () => api.get('/recebimentos-material'),
        get: (id) => api.get(`/recebimentos-material/${id}`),
        create: (data) => api.post('/recebimentos-material', data),
        update: (id, data) => api.put(`/recebimentos-material/${id}`, data),
        delete: (id) => api.delete(`/recebimentos-material/${id}`),
    },
};

// Interceptor para tratamento de erros
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // O servidor respondeu com um status de erro
            console.error('Erro na resposta:', error.response.data);
        } else if (error.request) {
            // A requisição foi feita mas não houve resposta
            console.error('Erro na requisição:', error.request);
        } else {
            // Algo aconteceu na configuração da requisição
            console.error('Erro:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
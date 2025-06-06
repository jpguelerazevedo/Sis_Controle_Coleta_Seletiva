import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333',
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
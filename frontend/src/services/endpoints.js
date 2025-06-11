import api from './api';

const endpoints = {
    materiais: {
        list: () => api.get('/materiais'),
        create: (data) => api.post('/materiais', data),
        update: (id, data) => api.put(`/materiais/${id}`, data),
        delete: (id) => api.delete(`/materiais/${id}`)
    },
    cargos: {
        list: () => api.get('/cargos'),
        create: (data) => api.post('/cargos', data),
        update: (id, data) => api.put(`/cargos/${id}`, data),
        delete: (id) => api.delete(`/cargos/${id}`)
    }
};

export default endpoints;
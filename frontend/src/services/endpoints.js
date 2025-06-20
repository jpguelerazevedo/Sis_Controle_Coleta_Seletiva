import axios from 'axios';

const endpoints = {
    materiais: {
        list: () => axios.get('https://scv-w0i2.onrender.com/materiais'),
        create: (data) => axios.post('https://scv-w0i2.onrender.com/materiais', data),
        update: (id, data) => axios.put(`https://scv-w0i2.onrender.com/materiais/${id}`, data),
        delete: (id) => axios.delete(`https://scv-w0i2.onrender.com/materiais/${id}`)
    },
    cargos: {
        list: () => axios.get('https://scv-w0i2.onrender.com/cargos'),
        create: (data) => axios.post('https://scv-w0i2.onrender.com/cargos', data),
        update: (id, data) => axios.put(`https://scv-w0i2.onrender.com/cargos/${id}`, data),
        delete: (id) => axios.delete(`https://scv-w0i2.onrender.com/cargos/${id}`)
    },
    clientes: {
        list: () => axios.get('https://scv-w0i2.onrender.com/clientes'),
        create: (data) => axios.post('https://scv-w0i2.onrender.com/clientes', data),
        update: (cpf, data) => axios.put(`https://scv-w0i2.onrender.com/clientes/${cpf}`, data),
        delete: (cpf) => axios.delete(`https://scv-w0i2.onrender.com/clientes/${cpf}`)
    },
    pessoas: {
        create: (data) => axios.post('https://scv-w0i2.onrender.com/pessoas', data),
        update: (cpf, data) => axios.put(`https://scv-w0i2.onrender.com/pessoas/${cpf}`, data),
        delete: (cpf) => axios.delete(`https://scv-w0i2.onrender.com/pessoas/${cpf}`)
    },
    enderecos: {
        create: (data) => axios.post('https://scv-w0i2.onrender.com/enderecos', data),
        update: (id, data) => axios.put(`https://scv-w0i2.onrender.com/enderecos/${id}`, data),
        delete: (id) => axios.delete(`https://scv-w0i2.onrender.com/enderecos/${id}`)
    },
    bairros: {
        list: () => axios.get('https://scv-w0i2.onrender.com/bairros')
    }
,
    colaboradores: {
        list: () => axios.get('https://scv-w0i2.onrender.com/colaboradores')
    },
    terceirizadas: {
        list: () => axios.get('https://scv-w0i2.onrender.com/terceirizadas')
    }
,
    envios: {
        list: () => axios.get('https://scv-w0i2.onrender.com/envios-material')
    }
,
    pedidos: {
        list: () => axios.get('https://scv-w0i2.onrender.com/pedidos-coleta')
    },
    recebimentos: {
        list: () => axios.get('https://scv-w0i2.onrender.com/recebimentos-material')
    }
};

export default endpoints;
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
        list: () => axios.get('https://scv-w0i2.onrender.com/bairros'),
        create: (data) => axios.post('https://scv-w0i2.onrender.com/bairros', data),
        update: (id, data) => axios.put(`https://scv-w0i2.onrender.com/bairros/${id}`, data),
        delete: (id) => axios.delete(`https://scv-w0i2.onrender.com/bairros/${id}`)
    },
    colaboradores: {
        list: () => axios.get('https://scv-w0i2.onrender.com/colaboradores'),
        create: (data) => axios.post('https://scv-w0i2.onrender.com/colaboradores', data),
        update: (cpf, data) => axios.put(`https://scv-w0i2.onrender.com/colaboradores/${cpf}`, data),
        delete: (cpf) => axios.delete(`https://scv-w0i2.onrender.com/colaboradores/${cpf}`)
    },
    terceirizadas: {
        list: () => axios.get('https://scv-w0i2.onrender.com/terceirizadas'),
        create: (data) => axios.post('https://scv-w0i2.onrender.com/terceirizadas', data),
        update: (cnpj, data) => axios.put(`https://scv-w0i2.onrender.com/terceirizadas/${cnpj}`, data),
        delete: (cnpj) => axios.delete(`https://scv-w0i2.onrender.com/terceirizadas/${cnpj}`)
    },
    envios: {
        list: () => axios.get('https://scv-w0i2.onrender.com/envios-material'),
        create: (data) => axios.post('https://scv-w0i2.onrender.com/envios-material', data),
        update: (id, data) => axios.put(`https://scv-w0i2.onrender.com/envios-material/${id}`, data),
        delete: (id) => axios.delete(`https://scv-w0i2.onrender.com/envios-material/${id}`)
    },
    pedidos: {
        list: () => axios.get('https://scv-w0i2.onrender.com/pedidos-coleta'),
        create: (data) => axios.post('https://scv-w0i2.onrender.com/pedidos-coleta', data),
        update: (id, data) => axios.put(`https://scv-w0i2.onrender.com/pedidos-coleta/${id}`, data),
        delete: (id) => axios.delete(`https://scv-w0i2.onrender.com/pedidos-coleta/${id}`)
    },
    recebimentos: {
        list: () => axios.get('https://scv-w0i2.onrender.com/recebimentos-material'),
        create: (data) => axios.post('https://scv-w0i2.onrender.com/recebimentos-material', data),
        update: (id, data) => axios.put(`https://scv-w0i2.onrender.com/recebimentos-material/${id}`, data),
        delete: (id) => axios.delete(`https://scv-w0i2.onrender.com/recebimentos-material/${id}`)
    }
};

export default endpoints;
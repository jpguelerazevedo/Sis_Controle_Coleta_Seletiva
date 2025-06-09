import React, { useEffect, useState } from 'react';
import { Alert, Button, Modal, Form } from 'react-bootstrap';
import { endpoints } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { DataGrid } from '@mui/x-data-grid';

function RecebimentosMaterial() {
    const [recebimentos, setRecebimentos] = useState([]);
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        peso: '',
        volume: '',
        idMaterial: '',
        cpfCliente: '',
        cpfColaborador: ''
    });
    const [materiais, setMateriais] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [colaboradores, setColaboradores] = useState([]);

    useEffect(() => {
        loadRecebimentos();
        loadMateriais();
        loadClientes();
        loadColaboradores();
    }, []);

    const loadRecebimentos = async () => {
        try {
            const response = await endpoints.recebimentosMaterial.list();
            setRecebimentos(response.data);
        } catch (error) {
            setAlert({ show: true, message: 'Erro ao carregar recebimentos', variant: 'danger' });
        }
    };

    const loadMateriais = async () => {
        try {
            const response = await endpoints.materiais.list();
            setMateriais(response.data);
        } catch (error) {
            setAlert({ show: true, message: 'Erro ao carregar materiais', variant: 'danger' });
        }
    };

    const loadClientes = async () => {
        try {
            const response = await endpoints.clientes.list();
            setClientes(response.data);
        } catch (error) {
            setAlert({ show: true, message: 'Erro ao carregar clientes', variant: 'danger' });
        }
    };

    const loadColaboradores = async () => {
        try {
            const response = await endpoints.colaboradores.list();
            setColaboradores(response.data);
        } catch (error) {
            setAlert({ show: true, message: 'Erro ao carregar colaboradores', variant: 'danger' });
        }
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({
            peso: '',
            volume: '',
            idMaterial: '',
            cpfCliente: '',
            cpfColaborador: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await endpoints.recebimentosMaterial.create(formData);
            setAlert({ show: true, message: 'Recebimento cadastrado com sucesso!', variant: 'success' });
            handleCloseModal();
            loadRecebimentos();
        } catch (error) {
            setAlert({ show: true, message: 'Erro ao cadastrar recebimento', variant: 'danger' });
        }
    };

    const getClienteNomeByCpf = (cpf) => {
        const cliente = clientes.find(c => c.cpf === cpf);
        return cliente ? cliente.nome : cpf;
    };

    const getColaboradorNomeByCpf = (cpf) => {
        const colaborador = colaboradores.find(c => c.cpf === cpf);
        return colaborador ? colaborador.nome : cpf;
    };

    const getMaterialNomeById = (id) => {
        const material = materiais.find(m => (m.id_material || m.id) === id);
        return material ? material.nome : id;
    };

    const columns = [
        { field: 'peso', headerName: 'Peso', width: 150 },
        { field: 'volume', headerName: 'Volume', width: 150 },
        {
            field: 'idMaterial',
            headerName: 'Material',
            width: 250,
            valueGetter: (params) => getMaterialNomeById(params.row.idMaterial || params.row.id_material)
        },
        {
            field: 'cpfCliente',
            headerName: 'Cliente',
            width: 250,
            valueGetter: (params) => getClienteNomeByCpf(params.row.cpfCliente || params.row.cpf_cliente)
        },
        {
            field: 'cpfColaborador',
            headerName: 'Colaborador',
            width: 250,
            valueGetter: (params) => getColaboradorNomeByCpf(params.row.cpfColaborador || params.row.cpf_colaborador)
        }
    ];

    const rows = recebimentos.map(r => ({
        idRecebimento: r.idRecebimento || r.id_recebimento,
        peso: r.peso,
        volume: r.volume,
        idMaterial: r.idMaterial || r.id_material,
        cpfCliente: r.cpfCliente || r.cpf_cliente,
        cpfColaborador: r.cpfColaborador || r.cpf_colaborador
    }));

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Recebimentos de Material</h2>
                <Button variant="primary" onClick={handleShowModal}>
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    Novo Recebimento
                </Button>
            </div>
            {alert.show && (
                <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
                    {alert.message}
                </Alert>
            )}
            <div style={{ height: 500, width: '100%', marginBottom: 24 }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    getRowId={row => row.id}
                    pageSize={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    disableSelectionOnClick
                    filterMode="client"
                    autoHeight={false}
                />
            </div>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Novo Recebimento</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Peso</Form.Label>
                            <Form.Control
                                type="number"
                                value={formData.peso}
                                onChange={e => setFormData({ ...formData, peso: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Volume</Form.Label>
                            <Form.Control
                                type="number"
                                value={formData.volume}
                                onChange={e => setFormData({ ...formData, volume: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Material</Form.Label>
                            <Form.Select
                                value={formData.idMaterial}
                                onChange={e => setFormData({ ...formData, idMaterial: e.target.value })}
                                required
                            >
                                <option value="">Selecione o material</option>
                                {materiais.map((mat) => (
                                    <option key={mat.id_material} value={mat.id_material}>
                                        {mat.nome}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>CPF Cliente</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.cpfCliente}
                                onChange={e => setFormData({ ...formData, cpfCliente: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>CPF Colaborador</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.cpfColaborador}
                                onChange={e => setFormData({ ...formData, cpfColaborador: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Cancelar
                            </Button>
                            <Button variant="primary" type="submit">
                                Cadastrar
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default RecebimentosMaterial;

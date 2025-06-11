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
        cpfCliente: '',
        cpfColaborador: '',
        peso: '',
        volume: '',
        idMaterial: ''
    });
    const [materiais, setMateriais] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [colaboradores, setColaboradores] = useState([]);
    const [selectedRecebimento, setSelectedRecebimento] = useState(null);

    useEffect(() => {
        loadRecebimentos();
        loadMateriais();
        loadClientes();
        loadColaboradores();
    }, []);

    const loadRecebimentos = async () => {
        try {
            const response = await endpoints.recebimentosMaterial.list();
            const recebimentosFormatados = response.data.map(recebimento => ({
                idRecebimento: recebimento.idRecebimento,
                idMaterial: recebimento.idMaterial,
                peso: recebimento.peso,
                volume: recebimento.volume,
                cpfCliente: recebimento.cpf_cliente,
                cpfColaborador: recebimento.cpf_colaborador,
                data_recebimento: recebimento.data_recebimento,
                status: recebimento.status
            }));
            setRecebimentos(recebimentosFormatados);
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

    const handleShowModal = () => {
        setShowModal(true);
        setSelectedRecebimento(null);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({
            cpfCliente: '',
            cpfColaborador: '',
            peso: '',
            volume: '',
            idMaterial: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDelete = async (recebimento) => {
        try {
            console.log('Excluindo recebimento:', recebimento.idRecebimento);
            await endpoints.recebimentosMaterial.delete(recebimento.idRecebimento);
            showAlert('Recebimento excluído com sucesso!', 'success');
            loadRecebimentos();
        } catch (error) {
            console.error('Erro ao excluir recebimento:', error);
            showAlert('Erro ao excluir recebimento: ' + error.message, 'danger');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const recebimentoData = {
                cpfCliente: formData.cpfCliente,
                cpfColaborador: formData.cpfColaborador,
                peso: parseFloat(formData.peso),
                volume: parseFloat(formData.volume),
                idMaterial: parseInt(formData.idMaterial)
            };

            await endpoints.recebimentosMaterial.create(recebimentoData);
            showAlert('Recebimento registrado com sucesso!', 'success');
            handleCloseModal();
            loadRecebimentos();
        } catch (error) {
            console.error('Erro ao salvar recebimento:', error);
            showAlert('Erro ao salvar recebimento: ' + error.message, 'danger');
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
        { field: 'idRecebimento', headerName: 'ID', width: 70 },
        { field: 'peso', headerName: 'Peso (kg)', width: 130 },
        { field: 'volume', headerName: 'Volume (m³)', width: 130 },
        { field: 'cpfCliente', headerName: 'Cliente', width: 130 },
        { field: 'cpfColaborador', headerName: 'Colaborador', width: 130 },
        { 
            field: 'data_recebimento', 
            headerName: 'Data', 
            width: 130,
            renderCell: (params) => {
                try {
                    if (!params.row.data_recebimento) return '';
                    const date = new Date(params.row.data_recebimento);
                    return date.toLocaleDateString('pt-BR');
                } catch (error) {
                    console.error('Erro ao formatar data:', error);
                    return '';
                }
            }
        },
        { field: 'status', headerName: 'Status', width: 130 },
        {
            field: 'acoes',
            headerName: 'Ações',
            width: 120,
            renderCell: (params) => (
                <div className="d-flex gap-2">
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(params.row)}
                    >
                        Excluir
                    </Button>
                </div>
            )
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

    const showAlert = (message, variant) => {
        setAlert({ show: true, message, variant });
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Recebimentos de Material</h2>
                <Button variant="primary" onClick={handleShowModal}>
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    Novo Recebimento
                </Button>
            </div>
            {alert.show && (
                <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
                    {alert.message}
                </Alert>
            )}
            {recebimentos.length === 0 ? (
                <div className="text-center">
                    <p>Nenhum recebimento encontrado.</p>
                </div>
            ) : (
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                        disableSelectionOnClick
                        getRowId={(row) => row.idRecebimento}
                        sx={{
                            height: 400,
                            width: '100%',
                            '& .MuiDataGrid-cell:focus': {
                                outline: 'none'
                            }
                        }}
                    />
                </div>
            )}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {selectedRecebimento ? 'Editar Recebimento' : 'Novo Recebimento de Material'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Material</Form.Label>
                            <Form.Select
                                name="idMaterial"
                                value={formData.idMaterial}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Selecione um material</option>
                                {materiais.map((material) => (
                                    <option key={material.idMaterial} value={material.idMaterial}>
                                        {material.nome}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>CPF do Cliente</Form.Label>
                            <Form.Control
                                type="text"
                                name="cpfCliente"
                                value={formData.cpfCliente}
                                onChange={handleInputChange}
                                required
                                pattern="\d{11}"
                                title="Digite um CPF válido (11 dígitos)"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>CPF do Colaborador</Form.Label>
                            <Form.Control
                                type="text"
                                name="cpfColaborador"
                                value={formData.cpfColaborador}
                                onChange={handleInputChange}
                                required
                                pattern="\d{11}"
                                title="Digite um CPF válido (11 dígitos)"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Peso (kg)</Form.Label>
                            <Form.Control
                                type="number"
                                name="peso"
                                value={formData.peso}
                                onChange={handleInputChange}
                                required
                                min="0"
                                step="0.01"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Volume (m³)</Form.Label>
                            <Form.Control
                                type="number"
                                name="volume"
                                value={formData.volume}
                                onChange={handleInputChange}
                                required
                                min="0"
                                step="0.01"
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Cancelar
                            </Button>
                            <Button variant="primary" type="submit">
                                {selectedRecebimento ? 'Atualizar' : 'Salvar'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default RecebimentosMaterial;

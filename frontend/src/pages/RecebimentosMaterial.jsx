import React, { useEffect, useState } from 'react';
import { Container, Button, Form, Modal, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import endpoints from '../services/endpoints';
import { DataGrid } from '@mui/x-data-grid';

function RecebimentosMaterial() {
    const [recebimentos, setRecebimentos] = useState([]);
    const [materiais, setMateriais] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [colaboradores, setColaboradores] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedRecebimento, setSelectedRecebimento] = useState(null);
    const [formData, setFormData] = useState({
        peso: '',
        volume: '',
        idMaterial: '',
        cpfCliente: '',
        cpfColaborador: ''
    });
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRecebimentos();
        loadMateriais();
        loadClientes();
        loadColaboradores();
    }, []);

    const loadRecebimentos = async () => {
        setLoading(true);
        try {
            const response = await endpoints.recebimentos.list();
            if (response && response.data) {
                const recebimentosFormatados = response.data.map(r => ({
                    id: r.idRecebimento || r.id_recebimento,
                    idRecebimento: r.idRecebimento || r.id_recebimento,
                    peso: r.peso,
                    volume: r.volume,
                    idMaterial: r.idMaterial,
                    cpfCliente: r.cpfCliente || r.cpf_cliente,
                    cpfColaborador: r.cpfColaborador || r.cpf_colaborador
                }));
                setRecebimentos(recebimentosFormatados);
            } else {
                setRecebimentos([]);
            }
        } catch (error) {
            showAlert('Erro ao carregar recebimentos: ' + error.message, 'danger');
            setRecebimentos([]);
        }
        setLoading(false);
    };

    const loadMateriais = async () => {
        try {
            const response = await endpoints.materiais.list();
            setMateriais(response.data || []);
        } catch (error) {
            showAlert('Erro ao carregar materiais', 'danger');
        }
    };

    const loadClientes = async () => {
        try {
            const response = await endpoints.clientes.list();
            setClientes(response.data || []);
        } catch (error) {
            showAlert('Erro ao carregar clientes', 'danger');
        }
    };

    const loadColaboradores = async () => {
        try {
            const response = await endpoints.colaboradores.list();
            setColaboradores(response.data || []);
        } catch (error) {
            showAlert('Erro ao carregar colaboradores', 'danger');
        }
    };

    const safeValue = (val) => (val !== undefined && val !== null ? val : '');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const recebimentoData = {
                peso: parseFloat(formData.peso),
                volume: parseFloat(formData.volume),
                idMaterial: parseInt(formData.idMaterial),
                cpfCliente: String(formData.cpfCliente),
                cpfColaborador: String(formData.cpfColaborador)
            };
            if (selectedRecebimento) {
                await endpoints.recebimentos.update(selectedRecebimento.idRecebimento, recebimentoData);
                showAlert('Recebimento atualizado com sucesso!', 'success');
            } else {
                await endpoints.recebimentos.create(recebimentoData);
                showAlert('Recebimento registrado com sucesso!', 'success');
            }
            handleCloseModal();
            loadRecebimentos();
        } catch (error) {
            showAlert('Erro ao salvar recebimento: ' + error.message, 'danger');
        }
    };

    const handleEdit = (recebimento) => {
        setSelectedRecebimento(recebimento);
        setFormData({
            peso: safeValue(recebimento.peso),
            volume: safeValue(recebimento.volume),
            idMaterial: safeValue(recebimento.idMaterial),
            cpfCliente: safeValue(recebimento.cpfCliente),
            cpfColaborador: safeValue(recebimento.cpfColaborador)
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedRecebimento(null);
        setFormData({
            peso: '',
            volume: '',
            idMaterial: '',
            cpfCliente: '',
            cpfColaborador: ''
        });
    };

    const showAlert = (message, variant) => {
        setAlert({ show: true, message, variant });
        setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 3000);
    };

    const columns = [
        {
            field: 'idMaterial',
            headerName: 'Material',
            width: 200,
            renderCell: (params) => {
                const idMaterial = params.row.idMaterial;
                const material = materiais.find(m => String(m.idMaterial) === String(idMaterial));
                return material ? material.nome : '';
            }
        },
        { field: 'peso', headerName: 'Peso (kg)', width: 120 },
        { field: 'volume', headerName: 'Volume (m³)', width: 120 },
        { field: 'cpfCliente', headerName: 'Cliente', width: 150 },
        { field: 'cpfColaborador', headerName: 'Colaborador', width: 150 }
        // Removido o campo 'acoes'
    ];

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Recebimentos de Material</h2>
                <Button
                    variant="primary"
                    onClick={() => {
                        setSelectedRecebimento(null);
                        setFormData({
                            peso: '',
                            volume: '',
                            idMaterial: '',
                            cpfCliente: '',
                            cpfColaborador: ''
                        });
                        setShowModal(true);
                    }}
                    className="mb-3"
                >
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    Novo Recebimento
                </Button>
            </div>
            {alert.show && (
                <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
                    {alert.message}
                </Alert>
            )}
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={recebimentos}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    disableSelectionOnClick
                    autoHeight
                    getRowId={row => row.idRecebimento || row.id_recebimento || row.id}
                    isRowSelectable={() => false}
                    disableVirtualization
                    loading={loading}
                />
            </div>
            <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {selectedRecebimento ? 'Editar Recebimento' : 'Novo Recebimento de Material'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        {/* Linha 1: Material, Peso */}
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Material</Form.Label>
                                    <Form.Select
                                        name="idMaterial"
                                        value={safeValue(formData.idMaterial)}
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
                            </div>

                        </div>
                        {/* Linha 2: Volume */}
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Volume</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="volume"
                                        value={safeValue(formData.volume)}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                        step="0.01"
                                        placeholder='Volume (m³)'
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Peso</Form.Label>
                                    <Form.Control
                                        placeholder='Peso (kg)'
                                        type="number"
                                        name="peso"
                                        value={safeValue(formData.peso)}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                        step="0.01"
                                    />
                                </Form.Group>
                            </div>
                        </div>
                        {/* Linha 3: Cliente e Colaborador */}
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>CPF do Cliente</Form.Label>
                                    <Form.Select
                                        name="cpfCliente"
                                        value={safeValue(formData.cpfCliente)}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Selecione o cliente</option>
                                        {clientes.map((cliente) => (
                                            <option key={cliente.cpf} value={cliente.cpf}>
                                                {(cliente.nome || (cliente.pessoa && cliente.pessoa.nome) || '') + ' - ' + cliente.cpf}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>CPF do Colaborador</Form.Label>
                                    <Form.Select
                                        name="cpfColaborador"
                                        value={safeValue(formData.cpfColaborador)}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Selecione o colaborador</option>
                                        {colaboradores.map((colab) => (
                                            <option key={colab.cpf} value={colab.cpf}>
                                                {(colab.nome || (colab.pessoa && colab.pessoa.nome) || '') + ' - ' + colab.cpf}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </div>
                        {/* Botões */}
                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Cancelar
                            </Button>
                            <Button variant="primary" type="submit">
                                {selectedRecebimento ? 'Atualizar' : 'Cadastrar'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default RecebimentosMaterial;

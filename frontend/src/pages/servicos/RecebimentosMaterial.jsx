import React, { useEffect, useState } from 'react';
import { Container, Button, Form, Modal, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import endpoints from '../../services/endpoints';
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
    const [alert, setAlert] = useState({ show: false, message: '', variant: '', modal: false });
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
            const recebimentosResponse = await endpoints.recebimentos.list();
            // Carrega materiais, clientes e colaboradores antes de processar recebimentos
            const materiaisResponse = await endpoints.materiais.list();
            const clientesResponse = await endpoints.clientes.list();
            const colaboradoresResponse = await endpoints.colaboradores.list();
            const materiaisArr = materiaisResponse.data || [];
            const clientesArr = clientesResponse.data || [];
            const colaboradoresArr = colaboradoresResponse.data || [];

            if (recebimentosResponse && recebimentosResponse.data) {
                const recebimentosFormatados = recebimentosResponse.data.map((r, idx) => {
                    // Mesma lógica de data do EnviosMaterial/PedidosColeta
                    let rawData = r.dataRecebimento || r.data_recebimento || r.data || r.createdAt || r.updatedAt || '';
                    let dataFormatada = '';
                    let horaFormatada = '';
                    if (rawData) {
                        const dateObj = new Date(rawData);
                        if (!isNaN(dateObj)) {
                            const dia = String(dateObj.getDate()).padStart(2, '0');
                            const mes = String(dateObj.getMonth() + 1).padStart(2, '0');
                            const ano = dateObj.getFullYear();
                            dataFormatada = `${dia}/${mes}/${ano}`;
                            const hora = String(dateObj.getHours()).padStart(2, '0');
                            const min = String(dateObj.getMinutes()).padStart(2, '0');
                            const seg = String(dateObj.getSeconds()).padStart(2, '0');
                            horaFormatada = `${hora}:${min}:${seg}`;
                        } else {
                            dataFormatada = rawData;
                            horaFormatada = '';
                        }
                    }
                    const material = materiaisArr.find(m => String(m.idMaterial) === String(r.idMaterial));
                    const cliente = clientesArr.find(c => String(c.cpf) === String(r.cpfCliente || r.cpf_cliente));
                    const colab = colaboradoresArr.find(c => String(c.cpf) === String(r.cpfColaborador || r.cpf_colaborador));
                    return {
                        id: r.idRecebimento || r.id_recebimento || idx,
                        idRecebimento: r.idRecebimento || r.id_recebimento,
                        peso: r.peso,
                        volume: r.volume,
                        idMaterial: r.idMaterial,
                        materialNome: material ? material.nome : '',
                        cpfCliente: r.cpfCliente || r.cpf_cliente,
                        clienteNome: cliente ? (cliente.nome || (cliente.pessoa && cliente.pessoa.nome) || '') : '',
                        cpfColaborador: r.cpfColaborador || r.cpf_colaborador,
                        colaboradorNome: colab ? (colab.nome || (colab.pessoa && colab.pessoa.nome) || '') : '',
                        data: dataFormatada,
                        hora: horaFormatada,
                        createdAt: rawData
                    };
                });
                setMateriais(materiaisArr);
                setClientes(clientesArr);
                setColaboradores(colaboradoresArr);
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
        let hadError = false;
        try {
            const recebimentoData = {
                peso: parseFloat(formData.peso),
                volume: parseFloat(formData.volume),
                idMaterial: parseInt(formData.idMaterial),
                cpfCliente: String(formData.cpfCliente),
                cpfColaborador: String(formData.cpfColaborador)
            };
            if (selectedRecebimento) {
                try {
                    await endpoints.recebimentos.update(selectedRecebimento.idRecebimento, recebimentoData);
                    showAlert('Recebimento atualizado com sucesso!', 'success');
                } catch (updateError) {
                    let backendMsg = updateError?.response?.data?.error || updateError?.response?.data?.message || updateError.message || 'Erro ao atualizar recebimento';
                    showAlert(backendMsg, 'danger', true);
                    hadError = true;
                }
            } else {
                try {
                    await endpoints.recebimentos.create(recebimentoData);
                    showAlert('Recebimento registrado com sucesso!', 'success');
                } catch (createError) {
                    let backendMsg = createError?.response?.data?.error || createError?.response?.data?.message || createError.message || 'Erro ao cadastrar recebimento';
                    showAlert(backendMsg, 'danger', true);
                    hadError = true;
                }
            }
            if (!hadError) {
                handleCloseModal();
            }
            loadRecebimentos();
        } catch (error) {
            let backendMsg = error?.response?.data?.error || error?.response?.data?.message || error.message || 'Erro ao salvar recebimento';
            showAlert(backendMsg, 'danger', true);
            // Não fecha o modal em caso de erro!
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

    const showAlert = (message, variant, modal = false) => {
        setAlert({ show: true, message, variant, modal });
        setTimeout(() => setAlert({ show: false, message: '', variant: '', modal: false }), 3000);
    };

    // Função para formatar CPF
    const formatCPFTable = (cpf) => {
        if (!cpf) return '';
        const cpfNumerico = cpf.replace(/\D/g, '');
        if (cpfNumerico.length !== 11) return cpf;
        return `${cpfNumerico.substring(0, 3)}.${cpfNumerico.substring(3, 6)}.${cpfNumerico.substring(6, 9)}-${cpfNumerico.substring(9, 11)}`;
    };

    const columns = [
        {
            field: 'materialNome',
            headerName: 'Material',
            width: 200,
            filterable: true,
        },
        { field: 'peso', headerName: 'Peso (kg)', width: 120 },
        { field: 'volume', headerName: 'Volume (m³)', width: 120 },
        {
            field: 'clienteNome',
            headerName: 'Cliente',
            width: 200,
            filterable: true,
        },
        {
            field: 'cpfCliente',
            headerName: 'CPF Cliente',
            width: 130,
            renderCell: (params) => formatCPFTable(params.value),
        },
        {
            field: 'colaboradorNome',
            headerName: 'Colaborador',
            width: 200,
            filterable: true,
        },
        {
            field: 'cpfColaborador',
            headerName: 'CPF Colaborador',
            width: 130,
            renderCell: (params) => formatCPFTable(params.value),
        },
        {
            field: 'data',
            headerName: 'Data',
            width: 100,
        },
        {
            field: 'hora',
            headerName: 'Hora',
            width: 90,
        }
    ];

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                <h2>Recebimento de Material</h2>
                <div className="col-12 col-md-auto px-0 mt-2 mt-md-0">
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
                        className="w-100"
                    >
                        <FontAwesomeIcon icon={faPlus} className="me-2" />
                        Novo Recebimento
                    </Button>
                </div>
            </div>
            <div style={{ width: '100%', marginBottom: 24 }}>
                <DataGrid
                    rows={[...recebimentos].sort((a, b) => {
                        // Ordena por createdAt desc (mais recente primeiro)
                        if (!a.createdAt) return 1;
                        if (!b.createdAt) return -1;
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    })}
                    columns={columns}
                    getRowId={row => row.id_Recebimento || row.idRecebimento || row.id}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 5, page: 0 } }
                    }}
                    pageSizeOptions={[5]}
                    pagination
                    disableSelectionOnClick
                    isRowSelectable={() => false}
                    loading={loading}
                    autoHeight={true}
                />
            </div>

            <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {selectedRecebimento ? 'Editar Recebimento' : 'Novo Recebimento de Material'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Mostra alerta dentro do modal se erro ao cadastrar */}
                    {alert.show && alert.modal && (
                        <Alert
                            variant={alert.variant}
                            onClose={() => setAlert({ show: false, message: '', variant: '', modal: false })}
                            dismissible
                            className="mb-3"
                        >
                            {alert.message}
                        </Alert>
                    )}
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
                                        <option value="">Selecione...</option>
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
                                        <option value="">Selecione...</option>
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
                                        <option value="">Selecione...</option>
                                        {colaboradores
                                            .filter(colab => {
                                                // Considera ativo se status/status_colaborador/estado contém "ativo" (case-insensitive)
                                                const status = (colab.status ?? colab.status_colaborador ?? colab.estado ?? '').toString().trim().toUpperCase();
                                                return status.includes('ATIVO');
                                            })
                                            .map((colab) => (
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
            {/* Alerta global só aparece se não for modal */}
            {alert.show && !alert.modal && (
                <Alert
                    variant={alert.variant}
                    onClose={() => setAlert({ show: false, message: '', variant: '', modal: false })}
                    dismissible
                    className="position-fixed top-0 end-0 m-3"
                    style={{ zIndex: 1050 }}
                >
                    {alert.message}
                </Alert>
            )}
        </Container>
    );
}

export default RecebimentosMaterial;

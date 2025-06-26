import React, { useEffect, useState } from 'react';
import { Container, Button, Form, Modal, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import endpoints from '../../services/endpoints';
import { DataGrid } from '@mui/x-data-grid';

function EnviosMaterial() {
    const [envios, setEnvios] = useState([]);
    const [materiais, setMateriais] = useState([]);
    const [terceirizadas, setTerceirizadas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedEnvio, setSelectedEnvio] = useState(null);
    const [formData, setFormData] = useState({
        idMaterial: '',
        cnpj: '',
        pesoEnviado: '',
        volumeEnviado: '' // Added volumeEnviado
    });
    const [alert, setAlert] = useState({ show: false, message: '', variant: '', modal: false });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEnvios();
        loadMateriais();
        loadTerceirizadas();
    }, []);

    const loadEnvios = async () => {
        setLoading(true);
        try {
            // Carrega materiais e terceirizadas antes de processar envios
            const materiaisResponse = await endpoints.materiais.list();
            const terceirizadasResponse = await endpoints.terceirizadas.list();
            const materiaisArr = materiaisResponse.data || [];
            const terceirizadasArr = terceirizadasResponse.data || [];

            const response = await endpoints.envios.list();
            if (response && response.data && response.data.length > 0) {
                const enviosFormatados = response.data.map((e, idx) => {
                    let rawData = e.dataEnvio || e.data_envio || e.data || e.createdAt || e.updatedAt || '';
                    let dataFormatada = '';
                    let horaFormatada = '';
                    let createdAt = e.createdAt || e.dataEnvio || e.data_envio || e.data || e.updatedAt || '';
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
                    const material = materiaisArr.find(m => String(m.idMaterial) === String(e.idMaterial));
                    const terceirizada = terceirizadasArr.find(t => String(t.cnpj) === String(e.cnpj));
                    return {
                        id: e.idEnvio || e.id_envio || idx,
                        idEnvio: e.idEnvio || e.id_envio,
                        idMaterial: e.idMaterial,
                        materialNome: material ? material.nome : '',
                        cnpj: e.cnpj,
                        terceirizadaNome: terceirizada ? terceirizada.nome : '',
                        pesoEnviado: e.pesoEnviado || e.peso_enviado,
                        volumeEnviado: e.volumeEnviado || e.volume_enviado,
                        data: dataFormatada,
                        hora: horaFormatada,
                        createdAt: createdAt
                    };
                });
                setMateriais(materiaisArr);
                setTerceirizadas(terceirizadasArr);
                setEnvios(enviosFormatados);
            } else if (response && response.data && response.data.length === 0) {
                showAlert('Nenhum envio encontrado.', 'warning');
            } else {
                showAlert('Erro ao buscar envios. Tente novamente.', 'danger');
            }
        } catch (error) {
            showAlert('Erro ao carregar envios: ' + error.message, 'danger');
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

    const loadTerceirizadas = async () => {
        try {
            const response = await endpoints.terceirizadas.list();
            setTerceirizadas(response.data || []);
        } catch (error) {
            showAlert('Erro ao carregar terceirizadas', 'danger');
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
            const envioData = {
                idMaterial: parseInt(formData.idMaterial),
                cnpj: String(formData.cnpj),
                pesoEnviado: parseFloat(formData.pesoEnviado),
                volumeEnviado: parseFloat(formData.volumeEnviado)
            };
            if (selectedEnvio) {
                try {
                    await endpoints.envios.update(selectedEnvio.idEnvio, envioData);
                    showAlert('Envio atualizado com sucesso!', 'success');
                } catch (updateError) {
                    let backendMsg = updateError?.response?.data?.error || updateError?.response?.data?.message || updateError.message || 'Erro ao atualizar envio';
                    showAlert(backendMsg, 'danger', true);
                    hadError = true;
                }
            } else {
                try {
                    await endpoints.envios.create(envioData);
                    showAlert('Envio registrado com sucesso!', 'success');
                } catch (createError) {
                    let backendMsg = createError?.response?.data?.error || createError?.response?.data?.message || createError.message || 'Erro ao cadastrar envio';
                    showAlert(backendMsg, 'danger', true);
                    hadError = true;
                }
            }
            if (!hadError) {
                handleCloseModal();
            }
            loadEnvios();
        } catch (error) {
            let backendMsg = error?.response?.data?.error || error?.response?.data?.message || error.message || 'Erro ao salvar envio';
            showAlert(backendMsg, 'danger', true);
            // Não fecha o modal em caso de erro!
        }
    };

    const handleEdit = (envio) => {
        setSelectedEnvio(envio);
        setFormData({
            idMaterial: safeValue(envio.idMaterial),
            cnpj: safeValue(envio.cnpj),
            pesoEnviado: safeValue(envio.pesoEnviado),
            volumeEnviado: safeValue(envio.volumeEnviado) // Added volumeEnviado
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedEnvio(null);
        setFormData({
            idMaterial: '',
            cnpj: '',
            pesoEnviado: '',
            volumeEnviado: '' // Added volumeEnviado
        });
    };

    const showAlert = (message, variant, modal = false) => {
        setAlert({ show: true, message, variant, modal });
        setTimeout(() => setAlert({ show: false, message: '', variant: '', modal: false }), 3000);
    };

    // Função para formatar CNPJ
    const formatCNPJTable = (cnpj) => {
        if (!cnpj) return '';
        const cnpjNumerico = cnpj.replace(/\D/g, '');
        if (cnpjNumerico.length !== 14) return cnpj;
        return `${cnpjNumerico.substring(0, 2)}.${cnpjNumerico.substring(2, 5)}.${cnpjNumerico.substring(5, 8)}/${cnpjNumerico.substring(8, 12)}-${cnpjNumerico.substring(12, 14)}`;
    };

    const columns = [
        {
            field: 'materialNome',
            headerName: 'Material',
            width: 200,
            filterable: true,
        },
        {
            field: 'terceirizadaNome',
            headerName: 'Terceirizada',
            width: 200,
            filterable: true,
        },
        {
            field: 'cnpj',
            headerName: 'CNPJ',
            width: 150,
            renderCell: (params) => formatCNPJTable(params.value),
        },
        { field: 'pesoEnviado', headerName: 'Peso (kg)', width: 120 },
        { field: 'volumeEnviado', headerName: 'Volume (m³)', width: 120 },
        { field: 'data', headerName: 'Data', width: 100 },
        { field: 'hora', headerName: 'Hora', width: 90 }
    ];

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                <h2>Envio de Material</h2>
                <div className="col-12 col-md-auto px-0 mt-2 mt-md-0">
                    <Button
                        variant="primary"
                        onClick={() => {
                            setSelectedEnvio(null);
                            setFormData({
                                idMaterial: '',
                                cnpj: '',
                                pesoEnviado: '',
                                volumeEnviado: '' // Added volumeEnviado
                            });
                            setShowModal(true);
                        }}
                        className=" w-100"
                    >
                        <FontAwesomeIcon icon={faPlus} className="me-2" />
                        Novo Envio
                    </Button>
                </div>
            </div>
            <div style={{ width: '100%', marginBottom: 24 }}>
                <DataGrid
                    rows={[...envios].sort((a, b) => {
                        // Ordena por createdAt desc (mais recente primeiro)
                        if (!a.createdAt) return 1;
                        if (!b.createdAt) return -1;
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    })}
                    columns={columns}
                    getRowId={row => row.idEnvio || row.id_envio || row.id}
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
                        {selectedEnvio ? 'Editar Envio' : 'Novo Envio de Material'}
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
                        {/* Linha 1: Material e Terceirizada */}
                        <div className="row">
                            <div className="col-md-7">
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
                            <div className="col-md-5">
                                <Form.Group className="mb-3">
                                    <Form.Label>Terceirizada</Form.Label>
                                    <Form.Select
                                        name="cnpj"
                                        value={safeValue(formData.cnpj)}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Selecione...</option>
                                        {terceirizadas
                                            .filter(t => {
                                                // Considera ativa se estado/status/status_terceirizada contém "ativo" (case-insensitive)
                                                const estado = (t.estado ?? t.status ?? t.status_terceirizada ?? '').toString().trim().toUpperCase();
                                                return estado.includes('ATIVO');
                                            })
                                            .map((t) => (
                                                <option key={t.cnpj} value={t.cnpj}>
                                                    {t.nome}
                                                </option>
                                            ))}
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </div>
                        {/* Linha 2: Peso Enviado e Volume Enviado */}
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Peso Enviado</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="pesoEnviado"
                                        value={safeValue(formData.pesoEnviado)}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                        step="0.01"
                                        placeholder='Peso (kg)'
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Volume Enviado</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="volumeEnviado"
                                        value={safeValue(formData.volumeEnviado)}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                        step="0.01"
                                        placeholder='Volume (m³)'
                                    />
                                </Form.Group>
                            </div>
                        </div>
                        {/* Botões */}
                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Cancelar
                            </Button>
                            <Button variant="primary" type="submit">
                                {selectedEnvio ? 'Atualizar' : 'Cadastrar'}
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

export default EnviosMaterial;

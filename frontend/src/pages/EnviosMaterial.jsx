import React, { useEffect, useState } from 'react';
import { Container, Button, Form, Modal, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { endpoints } from '../services/api';
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
        pesoEnviado: ''
    });
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

    useEffect(() => {
        loadEnvios();
        loadMateriais();
        loadTerceirizadas();
    }, []);

    const loadEnvios = async () => {
        try {
            const response = await endpoints.enviosMaterial.list();
            if (response && response.data) {
                const enviosFormatados = response.data.map(e => ({
                    id: e.idEnvio || e.id_envio,
                    idEnvio: e.idEnvio || e.id_envio,
                    idMaterial: e.idMaterial,
                    cnpj: e.cnpj,
                    pesoEnviado: e.pesoEnviado || e.peso_enviado
                }));
                setEnvios(enviosFormatados);
            } else {
                setEnvios([]);
            }
        } catch (error) {
            showAlert('Erro ao carregar envios: ' + error.message, 'danger');
            setEnvios([]);
        }
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
        try {
            const envioData = {
                idMaterial: parseInt(formData.idMaterial),
                cnpj: String(formData.cnpj),
                pesoEnviado: parseFloat(formData.pesoEnviado)
            };
            if (selectedEnvio) {
                await endpoints.enviosMaterial.update(selectedEnvio.idEnvio, envioData);
                showAlert('Envio atualizado com sucesso!', 'success');
            } else {
                await endpoints.enviosMaterial.create(envioData);
                showAlert('Envio registrado com sucesso!', 'success');
            }
            handleCloseModal();
            loadEnvios();
        } catch (error) {
            showAlert('Erro ao salvar envio: ' + error.message, 'danger');
        }
    };

    const handleEdit = (envio) => {
        setSelectedEnvio(envio);
        setFormData({
            idMaterial: safeValue(envio.idMaterial),
            cnpj: safeValue(envio.cnpj),
            pesoEnviado: safeValue(envio.pesoEnviado)
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedEnvio(null);
        setFormData({
            idMaterial: '',
            cnpj: '',
            pesoEnviado: ''
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
        {
            field: 'cnpj',
            headerName: 'Terceirizada',
            width: 200,
            renderCell: (params) => {
                const terceirizada = terceirizadas.find(t => String(t.cnpj) === String(params.row.cnpj));
                return terceirizada ? `${terceirizada.nome} - ${terceirizada.cnpj}` : params.row.cnpj;
            }
        },
        { field: 'pesoEnviado', headerName: 'Peso Enviado (kg)', width: 150 }
        // Removido o campo 'acoes'
    ];

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Envios de Material</h2>
                <Button
                    variant="primary"
                    onClick={() => {
                        setSelectedEnvio(null);
                        setFormData({
                            idMaterial: '',
                            cnpj: '',
                            pesoEnviado: ''
                        });
                        setShowModal(true);
                    }}
                    className="mb-3"
                >
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    Novo Envio
                </Button>
            </div>
            {alert.show && (
                <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
                    {alert.message}
                </Alert>
            )}
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={envios}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    disableSelectionOnClick
                    autoHeight
                    getRowId={row => row.idEnvio || row.id_envio || row.id}
                    isRowSelectable={() => false}
                    disableVirtualization
                />
            </div>
            <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {selectedEnvio ? 'Editar Envio' : 'Novo Envio de Material'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                                        <option value="">Selecione um material</option>
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
                                        <option value="">Selecione a terceirizada</option>
                                        {terceirizadas.map((t) => (
                                            <option key={t.cnpj} value={t.cnpj}>
                                                {t.cnpj}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </div>
                        {/* Linha 2: Peso Enviado */}
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
        </Container>
    );
}

export default EnviosMaterial;

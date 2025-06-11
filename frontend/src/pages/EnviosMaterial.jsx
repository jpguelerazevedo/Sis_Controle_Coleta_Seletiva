import { useEffect, useState } from 'react';
import { Table, Alert, Button, Modal, Form } from 'react-bootstrap';
import { endpoints } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { DataGrid } from '@mui/x-data-grid';

function EnviosMaterial() {
    const [envios, setEnvios] = useState([]);
    const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
    const [showModal, setShowModal] = useState(false);
    const [materiais, setMateriais] = useState([]);
    const [terceirizadas, setTerceirizadas] = useState([]);
    const [formData, setFormData] = useState({
        idMaterial: '',
        cnpj: '',
        pesoEnviado: ''
    });

    useEffect(() => {
        loadEnvios();
        loadMateriais();
        loadTerceirizadas();
    }, []);

    const loadEnvios = async () => {
        try {
            const response = await endpoints.enviosMaterial.list();
            setEnvios(response.data);
        } catch (error) {
            setAlert({ show: true, message: 'Erro ao carregar envios', variant: 'danger' });
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

    const loadTerceirizadas = async () => {
        try {
            const response = await endpoints.terceirizadas.list();
            setTerceirizadas(response.data);
        } catch (error) {
            setAlert({ show: true, message: 'Erro ao carregar terceirizadas', variant: 'danger' });
        }
    };

    const showAlert = (message, variant = 'success') => {
        setAlert({ show: true, message, variant });
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({
            idMaterial: '',
            cnpj: '',
            pesoEnviado: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const envioData = {
                idMaterial: parseInt(formData.idMaterial),
                cnpj: formData.cnpj,
                pesoEnviado: parseFloat(formData.pesoEnviado)
            };

            await endpoints.enviosMaterial.create(envioData);
            showAlert('Envio registrado com sucesso!');
            handleCloseModal();
            loadEnvios();
        } catch (error) {
            console.error('Erro ao salvar envio:', error);
            showAlert('Erro ao salvar envio: ' + error.message, 'danger');
        }
    };

   

    const columns = [
        { field: 'idEnvio', headerName: 'ID', width: 70 },
        { 
            field: 'idMaterial',
            headerName: 'Material',
            width: 200,
            valueGetter: (params) => {
                try {
                    if (!params.row || !params.row.idMaterial) return '';
                    const material = materiais.find(m => m.idMaterial === params.row.idMaterial);
                    return material ? material.nome : '';
                } catch (error) {
                    console.error('Erro ao buscar material:', error);
                    return '';
                }
            }
        },
        { field: 'cnpj', headerName: 'CNPJ', width: 150 },
        { field: 'pesoEnviado', headerName: 'Peso (kg)', width: 130 },
        
        
    ];

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Envios de Material</h2>
                <Button variant="primary" onClick={handleShowModal}>
                    <i className="bi bi-plus-circle me-2"></i>
                    Novo Envio
                </Button>
            </div>

            {alert.show && (
                <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
                    {alert.message}
                </Alert>
            )}

            {envios.length === 0 ? (
                <div className="text-center">
                    <p>Nenhum envio encontrado.</p>
                </div>
            ) : (
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={envios}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                        disableSelectionOnClick
                        getRowId={(row) => row.idEnvio || row.id_envio}
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
                    <Modal.Title>Novo Envio de Material</Modal.Title>
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
                            <Form.Label>CNPJ da Terceirizada</Form.Label>
                            <Form.Control
                                type="text"
                                name="cnpj"
                                value={formData.cnpj}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Peso Enviado (kg)</Form.Label>
                            <Form.Control
                                type="number"
                                name="pesoEnviado"
                                value={formData.pesoEnviado}
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
                                Salvar
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default EnviosMaterial;

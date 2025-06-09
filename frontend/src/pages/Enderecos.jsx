import { useEffect, useState } from 'react';
import { Table, Alert, Button, Modal, Form } from 'react-bootstrap';
import { endpoints } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { DataGrid } from '@mui/x-data-grid';

function Enderecos() {
    const [enderecos, setEnderecos] = useState([]);
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        rua: '',
        numero: '',
        referencia: '',
        cep: '',
        id_bairro: ''
    });
    const [bairros, setBairros] = useState([]);

    useEffect(() => {
        loadEnderecos();
        loadBairros();
    }, []);

    const loadEnderecos = async () => {
        try {
            const response = await endpoints.enderecos.list();
            setEnderecos(response.data);
        } catch (error) {
            setAlert({ show: true, message: 'Erro ao carregar endereços', variant: 'danger' });
        }
    };

    const loadBairros = async () => {
        try {
            const response = await endpoints.bairros.list();
            setBairros(response.data);
        } catch (error) {
            setAlert({ show: true, message: 'Erro ao carregar bairros', variant: 'danger' });
        }
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({
            rua: '',
            numero: '',
            referencia: '',
            cep: '',
            id_bairro: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await endpoints.enderecos.create(formData);
            setAlert({ show: true, message: 'Endereço cadastrado com sucesso!', variant: 'success' });
            handleCloseModal();
            loadEnderecos();
        } catch (error) {
            setAlert({ show: true, message: 'Erro ao cadastrar endereço', variant: 'danger' });
        }
    };

    const columns = [
        { field: 'rua', headerName: 'Rua', width: 250 },
        { field: 'numero', headerName: 'Número', width: 120 },
        { field: 'referencia', headerName: 'Referência', width: 300 },
        { field: 'cep', headerName: 'CEP', width: 180 },
        {
            field: 'bairro_nome',
            headerName: 'Bairro',
            width: 200,
            valueGetter: (params) =>
                params.row.bairro?.nome ||
                (bairros.find(b => b.id_bairro === params.row.id_bairro)?.nome || '')
        }
    ];

    const rows = enderecos.map(e => ({
        ...e,
        bairro_nome: e.bairro?.nome || (bairros.find(b => b.id_bairro === e.id_bairro)?.nome || '')
    }));

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Endereços</h2>
                <Button variant="primary" onClick={handleShowModal}>
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    Novo Endereço
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
                    getRowId={row => row.id_endereco}
                    pageSize={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    disableSelectionOnClick
                    filterMode="client"
                    autoHeight={false}
                />
            </div>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Novo Endereço</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Rua</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.rua}
                                onChange={e => setFormData({ ...formData, rua: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Número</Form.Label>
                            <Form.Control
                                type="number"
                                value={formData.numero}
                                onChange={e => setFormData({ ...formData, numero: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Referência</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.referencia}
                                onChange={e => setFormData({ ...formData, referencia: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>CEP</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.cep}
                                onChange={e => setFormData({ ...formData, cep: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Bairro</Form.Label>
                            <Form.Select
                                value={formData.id_bairro}
                                onChange={e => setFormData({ ...formData, id_bairro: e.target.value })}
                                required
                            >
                                <option value="">Selecione o bairro</option>
                                {bairros.map((bairro) => (
                                    <option key={bairro.id_bairro} value={bairro.id_bairro}>
                                        {bairro.nome}
                                    </option>
                                ))}
                            </Form.Select>
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

export default Enderecos;

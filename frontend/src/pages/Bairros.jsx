import { useEffect, useState } from 'react';
import { Table, Alert, Button, Modal, Form } from 'react-bootstrap';
import { endpoints } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { DataGrid } from '@mui/x-data-grid';

function Bairros() {
    const [bairros, setBairros] = useState([]);
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        distancia_sede: '',
        qnt_pessoas_cadastradas: '',
        estado_de_acesso: ''
    });

    useEffect(() => {
        loadBairros();
    }, []);

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
            nome: '',
            distancia_sede: '',
            qnt_pessoas_cadastradas: '',
            estado_de_acesso: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await endpoints.bairros.create(formData);
            setAlert({ show: true, message: 'Bairro cadastrado com sucesso!', variant: 'success' });
            handleCloseModal();
            loadBairros();
        } catch (error) {
            setAlert({ show: true, message: 'Erro ao cadastrar bairro', variant: 'danger' });
        }
    };

    const columns = [
        { field: 'nome', headerName: 'Nome', width: 250 },
        { field: 'distancia_sede', headerName: 'Distância Sede', width: 200 },
        { field: 'qnt_pessoas_cadastradas', headerName: 'Qtd. Pessoas Cadastradas', width: 200 },
        { field: 'estado_de_acesso', headerName: 'Estado de Acesso', width: 200 },
    ];

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Bairros</h2>
                <Button variant="primary" onClick={handleShowModal}>
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    Novo Bairro
                </Button>
            </div>
            {alert.show && (
                <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
                    {alert.message}
                </Alert>
            )}
            <div style={{ height: 500, width: '100%', marginBottom: 24 }}>
                <DataGrid
                    rows={bairros}
                    columns={columns}
                    getRowId={row => row.id_bairro}
                    pageSize={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    disableSelectionOnClick
                    filterMode="client"
                    autoHeight={false}
                />
            </div>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Novo Bairro</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.nome}
                                onChange={e => setFormData({ ...formData, nome: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Distância Sede</Form.Label>
                            <Form.Control
                                type="number"
                                value={formData.distancia_sede}
                                onChange={e => setFormData({ ...formData, distancia_sede: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Qtd. Pessoas Cadastradas</Form.Label>
                            <Form.Control
                                type="number"
                                value={formData.qnt_pessoas_cadastradas}
                                onChange={e => setFormData({ ...formData, qnt_pessoas_cadastradas: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Estado de Acesso</Form.Label>
                            <Form.Select
                                value={formData.estado_de_acesso}
                                onChange={e => setFormData({ ...formData, estado_de_acesso: e.target.value })}
                                required
                            >
                                <option value="">Selecione o estado de acesso</option>
                                <option value="normal">Normal</option>
                                <option value="obstruido">Obstruído</option>
                                <option value="dificil acesso">Difícil acesso</option>
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

export default Bairros;

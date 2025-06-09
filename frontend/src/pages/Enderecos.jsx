import { useEffect, useState } from 'react';
import { Table, Alert, Button, Modal, Form } from 'react-bootstrap';
import { endpoints } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

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

    useEffect(() => {
        loadEnderecos();
    }, []);

    const loadEnderecos = async () => {
        try {
            const response = await endpoints.enderecos.list();
            setEnderecos(response.data);
        } catch (error) {
            setAlert({ show: true, message: 'Erro ao carregar endereços', variant: 'danger' });
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
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Rua</th>
                        <th>Número</th>
                        <th>Referência</th>
                        <th>CEP</th>
                        <th>Bairro</th>
                    </tr>
                </thead>
                <tbody>
                    {enderecos.map((endereco) => (
                        <tr key={endereco.id_endereco}>
                            <td>{endereco.id_endereco}</td>
                            <td>{endereco.rua}</td>
                            <td>{endereco.numero}</td>
                            <td>{endereco.referencia}</td>
                            <td>{endereco.cep}</td>
                            <td>{endereco.bairro?.nome || endereco.id_bairro}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
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
                            <Form.Label>ID Bairro</Form.Label>
                            <Form.Control
                                type="number"
                                value={formData.id_bairro}
                                onChange={e => setFormData({ ...formData, id_bairro: e.target.value })}
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

export default Enderecos;

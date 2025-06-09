import { useEffect, useState } from 'react';
import { Table, Alert, Button, Modal, Form } from 'react-bootstrap';
import { endpoints } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

function Pessoas() {
    const [pessoas, setPessoas] = useState([]);
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        cpf: '',
        nome: '',
        email: '',
        telefone: '',
        sexo: ''
    });

    useEffect(() => {
        loadPessoas();
    }, []);

    const loadPessoas = async () => {
        try {
            const response = await endpoints.pessoas.list();
            setPessoas(response.data);
        } catch (error) {
            setAlert({ show: true, message: 'Erro ao carregar pessoas', variant: 'danger' });
        }
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({
            cpf: '',
            nome: '',
            email: '',
            telefone: '',
            sexo: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await endpoints.pessoas.create(formData);
            setAlert({ show: true, message: 'Pessoa cadastrada com sucesso!', variant: 'success' });
            handleCloseModal();
            loadPessoas();
        } catch (error) {
            setAlert({ show: true, message: 'Erro ao cadastrar pessoa', variant: 'danger' });
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Pessoas</h2>
                <Button variant="primary" onClick={handleShowModal}>
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    Nova Pessoa
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
                        <th>CPF</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>Sexo</th>
                    </tr>
                </thead>
                <tbody>
                    {pessoas.map((pessoa) => (
                        <tr key={pessoa.cpf}>
                            <td>{pessoa.cpf}</td>
                            <td>{pessoa.nome}</td>
                            <td>{pessoa.email}</td>
                            <td>{pessoa.telefone}</td>
                            <td>{pessoa.sexo}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Nova Pessoa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>CPF</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.cpf}
                                onChange={e => setFormData({ ...formData, cpf: e.target.value })}
                                required
                            />
                        </Form.Group>
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
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Telefone</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.telefone}
                                onChange={e => setFormData({ ...formData, telefone: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Sexo</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.sexo}
                                onChange={e => setFormData({ ...formData, sexo: e.target.value })}
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

export default Pessoas;

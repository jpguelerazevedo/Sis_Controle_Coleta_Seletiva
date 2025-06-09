import React, { useEffect, useState } from 'react';
import { Table, Alert, Button, Modal, Form } from 'react-bootstrap';
import { endpoints } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

function RecebimentosMaterial() {
    const [recebimentos, setRecebimentos] = useState([]);
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        peso: '',
        volume: '',
        idMaterial: '',
        cpfCliente: '',
        cpfColaborador: ''
    });
    const [materiais, setMateriais] = useState([]);

    useEffect(() => {
        loadRecebimentos();
        loadMateriais();
    }, []);

    const loadRecebimentos = async () => {
        try {
            const response = await endpoints.recebimentosMaterial.list();
            setRecebimentos(response.data);
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

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({
            peso: '',
            volume: '',
            idMaterial: '',
            cpfCliente: '',
            cpfColaborador: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await endpoints.recebimentosMaterial.create(formData);
            setAlert({ show: true, message: 'Recebimento cadastrado com sucesso!', variant: 'success' });
            handleCloseModal();
            loadRecebimentos();
        } catch (error) {
            setAlert({ show: true, message: 'Erro ao cadastrar recebimento', variant: 'danger' });
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Recebimentos de Material</h2>
                <Button variant="primary" onClick={handleShowModal}>
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    Novo Recebimento
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
                        <th>Peso</th>
                        <th>Volume</th>
                        <th>Material</th>
                        <th>Cliente</th>
                        <th>Colaborador</th>
                    </tr>
                </thead>
                <tbody>
                    {recebimentos.map((rec) => (
                        <tr key={rec.idRecebimento || rec.id_recebimento}>
                            <td>{rec.idRecebimento || rec.id_recebimento}</td>
                            <td>{rec.peso}</td>
                            <td>{rec.volume}</td>
                            <td>{rec.material?.nome || rec.idMaterial || rec.id_material}</td>
                            <td>{rec.cliente?.nome || rec.cpfCliente || rec.cpf_cliente}</td>
                            <td>{rec.colaborador?.nome || rec.cpfColaborador || rec.cpf_colaborador}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Novo Recebimento</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Peso</Form.Label>
                            <Form.Control
                                type="number"
                                value={formData.peso}
                                onChange={e => setFormData({ ...formData, peso: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Volume</Form.Label>
                            <Form.Control
                                type="number"
                                value={formData.volume}
                                onChange={e => setFormData({ ...formData, volume: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Material</Form.Label>
                            <Form.Select
                                value={formData.idMaterial}
                                onChange={e => setFormData({ ...formData, idMaterial: e.target.value })}
                                required
                            >
                                <option value="">Selecione o material</option>
                                {materiais.map((mat) => (
                                    <option key={mat.id_material} value={mat.id_material}>
                                        {mat.nome}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>CPF Cliente</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.cpfCliente}
                                onChange={e => setFormData({ ...formData, cpfCliente: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>CPF Colaborador</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.cpfColaborador}
                                onChange={e => setFormData({ ...formData, cpfColaborador: e.target.value })}
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

export default RecebimentosMaterial;

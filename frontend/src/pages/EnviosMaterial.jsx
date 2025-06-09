import { useEffect, useState } from 'react';
import { Table, Alert, Button, Modal, Form } from 'react-bootstrap';
import { endpoints } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

function EnviosMaterial() {
    const [envios, setEnvios] = useState([]);
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
    const [showModal, setShowModal] = useState(false);
    const [materiais, setMateriais] = useState([]);
    const [formData, setFormData] = useState({
        idMaterial: '',
        pesoEnviado: '',
        cnpj: ''
    });

    useEffect(() => {
        loadEnvios();
        loadMateriais();
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

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({
            idMaterial: '',
            pesoEnviado: '',
            cnpj: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await endpoints.enviosMaterial.create(formData);
            setAlert({ show: true, message: 'Envio cadastrado com sucesso!', variant: 'success' });
            handleCloseModal();
            loadEnvios();
        } catch (error) {
            setAlert({ show: true, message: 'Erro ao cadastrar envio', variant: 'danger' });
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Envios de Material</h2>
                <Button variant="primary" onClick={handleShowModal}>
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    Novo Envio
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
                        <th>Material</th>
                        <th>Peso Enviado</th>
                        <th>Terceirizada</th>
                    </tr>
                </thead>
                <tbody>
                    {envios.map((envio) => (
                        <tr key={envio.idEnvio || envio.id_envio}>
                            <td>{envio.idEnvio || envio.id_envio}</td>
                            <td>{envio.material?.nome || envio.idMaterial || envio.id_material}</td>
                            <td>{envio.pesoEnviado || envio.peso_enviado}</td>
                            <td>{envio.terceirizada?.nome || envio.cnpj}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Novo Envio</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
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
                            <Form.Label>Peso Enviado</Form.Label>
                            <Form.Control
                                type="number"
                                value={formData.pesoEnviado}
                                onChange={e => setFormData({ ...formData, pesoEnviado: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>CNPJ Terceirizada</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.cnpj}
                                onChange={e => setFormData({ ...formData, cnpj: e.target.value })}
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

export default EnviosMaterial;

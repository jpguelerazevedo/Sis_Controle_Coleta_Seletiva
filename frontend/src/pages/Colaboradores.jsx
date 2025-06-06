import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { endpoints } from '../services/api';

function Colaboradores() {
  const [colaboradores, setColaboradores] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedColaborador, setSelectedColaborador] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    cargo_id: '',
    data_contratacao: '',
    status: 'ativo'
  });
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  useEffect(() => {
    loadColaboradores();
    loadCargos();
  }, []);

  const loadColaboradores = async () => {
    try {
      const response = await endpoints.colaboradores.list();
      setColaboradores(response.data);
    } catch (error) {
      showAlert('Erro ao carregar colaboradores', 'danger');
    }
  };

  const loadCargos = async () => {
    try {
      const response = await endpoints.cargos.list();
      setCargos(response.data);
    } catch (error) {
      showAlert('Erro ao carregar cargos', 'danger');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedColaborador) {
        await endpoints.colaboradores.update(selectedColaborador.id, formData);
        showAlert('Colaborador atualizado com sucesso!', 'success');
      } else {
        await endpoints.colaboradores.create(formData);
        showAlert('Colaborador cadastrado com sucesso!', 'success');
      }
      handleCloseModal();
      loadColaboradores();
    } catch (error) {
      showAlert('Erro ao salvar colaborador', 'danger');
    }
  };

  const handleEdit = (colaborador) => {
    setSelectedColaborador(colaborador);
    setFormData({
      nome: colaborador.nome,
      email: colaborador.email,
      telefone: colaborador.telefone,
      endereco: colaborador.endereco,
      cargo_id: colaborador.cargo_id,
      data_contratacao: colaborador.data_contratacao,
      status: colaborador.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este colaborador?')) {
      try {
        await endpoints.colaboradores.delete(id);
        showAlert('Colaborador excluído com sucesso!', 'success');
        loadColaboradores();
      } catch (error) {
        showAlert('Erro ao excluir colaborador', 'danger');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedColaborador(null);
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      endereco: '',
      cargo_id: '',
      data_contratacao: '',
      status: 'ativo'
    });
  };

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 3000);
  };

  const getStatusBadge = (status) => {
    const variants = {
      ativo: 'success',
      inativo: 'danger',
      ferias: 'warning',
      afastado: 'info'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getCargoNome = (id) => {
    const cargo = cargos.find(c => c.id === id);
    return cargo ? cargo.nome : 'Cargo não encontrado';
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Colaboradores</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Novo Colaborador
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
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Cargo</th>
            <th>Data de Contratação</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {colaboradores.map((colaborador) => (
            <tr key={colaborador.id}>
              <td>{colaborador.nome}</td>
              <td>{colaborador.email}</td>
              <td>{colaborador.telefone}</td>
              <td>{getCargoNome(colaborador.cargo_id)}</td>
              <td>{new Date(colaborador.data_contratacao).toLocaleDateString()}</td>
              <td>{getStatusBadge(colaborador.status)}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(colaborador)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(colaborador.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedColaborador ? 'Editar Colaborador' : 'Novo Colaborador'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Telefone</Form.Label>
              <Form.Control
                type="tel"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Endereço</Form.Label>
              <Form.Control
                type="text"
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cargo</Form.Label>
              <Form.Select
                value={formData.cargo_id}
                onChange={(e) => setFormData({ ...formData, cargo_id: e.target.value })}
                required
              >
                <option value="">Selecione um cargo</option>
                {cargos.map((cargo) => (
                  <option key={cargo.id} value={cargo.id}>
                    {cargo.nome}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Data de Contratação</Form.Label>
              <Form.Control
                type="date"
                value={formData.data_contratacao}
                onChange={(e) => setFormData({ ...formData, data_contratacao: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
                <option value="ferias">Férias</option>
                <option value="afastado">Afastado</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                {selectedColaborador ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Colaboradores; 
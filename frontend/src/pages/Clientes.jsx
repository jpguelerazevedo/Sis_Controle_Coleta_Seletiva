import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { endpoints } from '../services/api';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    bairro: ''
  });
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const [bairros, setBairros] = useState([]);

  useEffect(() => {
    loadClientes();
    loadBairros();
  }, []);

  const loadClientes = async () => {
    try {
      const response = await endpoints.clientes.list();
      setClientes(response.data);
    } catch (error) {
      showAlert('Erro ao carregar clientes', 'danger');
    }
  };

  const loadBairros = async () => {
    try {
      const response = await endpoints.bairros.list();
      setBairros(response.data);
    } catch (error) {
      showAlert('Erro ao carregar bairros', 'danger');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCliente) {
        await endpoints.clientes.update(selectedCliente.id, formData);
        showAlert('Cliente atualizado com sucesso!', 'success');
      } else {
        await endpoints.clientes.create(formData);
        showAlert('Cliente cadastrado com sucesso!', 'success');
      }
      handleCloseModal();
      loadClientes();
    } catch (error) {
      showAlert('Erro ao salvar cliente', 'danger');
    }
  };

  const handleEdit = (cliente) => {
    setSelectedCliente(cliente);
    setFormData({
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      endereco: cliente.endereco,
      bairro: cliente.bairro
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await endpoints.clientes.delete(id);
        showAlert('Cliente excluído com sucesso!', 'success');
        loadClientes();
      } catch (error) {
        showAlert('Erro ao excluir cliente', 'danger');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCliente(null);
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      endereco: '',
      bairro: ''
    });
  };

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 3000);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Clientes</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Novo Cliente
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
            <th>Endereço</th>
            <th>Bairro</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.nome}</td>
              <td>{cliente.email}</td>
              <td>{cliente.telefone}</td>
              <td>{cliente.endereco}</td>
              <td>{cliente.bairro}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(cliente)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(cliente.id)}
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
            {selectedCliente ? 'Editar Cliente' : 'Novo Cliente'}
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
              <Form.Label>Bairro</Form.Label>
              <Form.Select
                value={formData.bairro}
                onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                required
              >
                <option value="">Selecione o bairro</option>
                {bairros.map((bairro) => (
                  <option key={bairro.id_bairro} value={bairro.nome}>
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
                {selectedCliente ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Clientes;
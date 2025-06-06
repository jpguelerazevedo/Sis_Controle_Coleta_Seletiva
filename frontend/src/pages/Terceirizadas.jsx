import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { endpoints } from '../services/api';

function Terceirizadas() {
  const [terceirizadas, setTerceirizadas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTerceirizada, setSelectedTerceirizada] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
    tipo_servico: '',
    status: 'ativo'
  });
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  useEffect(() => {
    loadTerceirizadas();
  }, []);

  const loadTerceirizadas = async () => {
    try {
      const response = await endpoints.terceirizadas.list();
      setTerceirizadas(response.data);
    } catch (error) {
      showAlert('Erro ao carregar terceirizadas', 'danger');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedTerceirizada) {
        await endpoints.terceirizadas.update(selectedTerceirizada.id, formData);
        showAlert('Terceirizada atualizada com sucesso!', 'success');
      } else {
        await endpoints.terceirizadas.create(formData);
        showAlert('Terceirizada cadastrada com sucesso!', 'success');
      }
      handleCloseModal();
      loadTerceirizadas();
    } catch (error) {
      showAlert('Erro ao salvar terceirizada', 'danger');
    }
  };

  const handleEdit = (terceirizada) => {
    setSelectedTerceirizada(terceirizada);
    setFormData({
      nome: terceirizada.nome,
      cnpj: terceirizada.cnpj,
      email: terceirizada.email,
      telefone: terceirizada.telefone,
      endereco: terceirizada.endereco,
      tipo_servico: terceirizada.tipo_servico,
      status: terceirizada.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta terceirizada?')) {
      try {
        await endpoints.terceirizadas.delete(id);
        showAlert('Terceirizada excluída com sucesso!', 'success');
        loadTerceirizadas();
      } catch (error) {
        showAlert('Erro ao excluir terceirizada', 'danger');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTerceirizada(null);
    setFormData({
      nome: '',
      cnpj: '',
      email: '',
      telefone: '',
      endereco: '',
      tipo_servico: '',
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
      pendente: 'warning'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const formatCNPJ = (cnpj) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Terceirizadas</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Nova Terceirizada
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
            <th>CNPJ</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Tipo de Serviço</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {terceirizadas.map((terceirizada) => (
            <tr key={terceirizada.id}>
              <td>{terceirizada.nome}</td>
              <td>{formatCNPJ(terceirizada.cnpj)}</td>
              <td>{terceirizada.email}</td>
              <td>{terceirizada.telefone}</td>
              <td>{terceirizada.tipo_servico}</td>
              <td>{getStatusBadge(terceirizada.status)}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(terceirizada)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(terceirizada.id)}
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
            {selectedTerceirizada ? 'Editar Terceirizada' : 'Nova Terceirizada'}
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
              <Form.Label>CNPJ</Form.Label>
              <Form.Control
                type="text"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                placeholder="00000000000000"
                maxLength={14}
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
              <Form.Label>Tipo de Serviço</Form.Label>
              <Form.Select
                value={formData.tipo_servico}
                onChange={(e) => setFormData({ ...formData, tipo_servico: e.target.value })}
                required
              >
                <option value="">Selecione um tipo de serviço</option>
                <option value="coleta">Coleta</option>
                <option value="processamento">Processamento</option>
                <option value="transporte">Transporte</option>
                <option value="outros">Outros</option>
              </Form.Select>
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
                <option value="pendente">Pendente</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                {selectedTerceirizada ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Terceirizadas; 
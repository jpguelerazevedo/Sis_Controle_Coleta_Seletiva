import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { endpoints } from '../services/api';

function Materiais() {
  const [materiais, setMateriais] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    tipo: '',
    descricao: '',
    preco_kg: '',
    estoque: '',
    status: 'ativo'
  });
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  useEffect(() => {
    loadMateriais();
  }, []);

  const loadMateriais = async () => {
    try {
      const response = await endpoints.materiais.list();
      setMateriais(response.data);
    } catch (error) {
      showAlert('Erro ao carregar materiais', 'danger');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedMaterial) {
        await endpoints.materiais.update(selectedMaterial.id, formData);
        showAlert('Material atualizado com sucesso!', 'success');
      } else {
        await endpoints.materiais.create(formData);
        showAlert('Material cadastrado com sucesso!', 'success');
      }
      handleCloseModal();
      loadMateriais();
    } catch (error) {
      showAlert('Erro ao salvar material', 'danger');
    }
  };

  const handleEdit = (material) => {
    setSelectedMaterial(material);
    setFormData({
      nome: material.nome,
      tipo: material.tipo,
      descricao: material.descricao,
      preco_kg: material.preco_kg,
      estoque: material.estoque,
      status: material.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este material?')) {
      try {
        await endpoints.materiais.delete(id);
        showAlert('Material excluído com sucesso!', 'success');
        loadMateriais();
      } catch (error) {
        showAlert('Erro ao excluir material', 'danger');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMaterial(null);
    setFormData({
      nome: '',
      tipo: '',
      descricao: '',
      preco_kg: '',
      estoque: '',
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
      em_estoque: 'warning'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Materiais</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Novo Material
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
            <th>Tipo</th>
            <th>Descrição</th>
            <th>Preço/Kg</th>
            <th>Estoque</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {materiais.map((material) => (
            <tr key={material.id}>
              <td>{material.nome}</td>
              <td>{material.tipo}</td>
              <td>{material.descricao}</td>
              <td>R$ {material.preco_kg}</td>
              <td>{material.estoque} kg</td>
              <td>{getStatusBadge(material.status)}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(material)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(material.id)}
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
            {selectedMaterial ? 'Editar Material' : 'Novo Material'}
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
              <Form.Label>Tipo</Form.Label>
              <Form.Select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                required
              >
                <option value="">Selecione um tipo</option>
                <option value="papel">Papel</option>
                <option value="plastico">Plástico</option>
                <option value="vidro">Vidro</option>
                <option value="metal">Metal</option>
                <option value="outros">Outros</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Preço por Kg (R$)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={formData.preco_kg}
                onChange={(e) => setFormData({ ...formData, preco_kg: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Estoque (kg)</Form.Label>
              <Form.Control
                type="number"
                step="0.1"
                value={formData.estoque}
                onChange={(e) => setFormData({ ...formData, estoque: e.target.value })}
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
                <option value="em_estoque">Em Estoque</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                {selectedMaterial ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Materiais; 
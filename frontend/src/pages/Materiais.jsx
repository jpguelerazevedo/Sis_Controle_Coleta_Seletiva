import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { endpoints } from '../services/api';
import { DataGrid } from '@mui/x-data-grid';

function Materiais() {
  const [materiais, setMateriais] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    peso: '',
    volume: '',
    nivelDeRisco: ''
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
        await endpoints.materiais.update(selectedMaterial.idMaterial, formData);
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
      peso: material.peso,
      volume: material.volume,
      nivelDeRisco: material.nivelDeRisco
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
      peso: '',
      volume: '',
      nivelDeRisco: ''
    });
  };

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 3000);
  };

  const columns = [
    { field: 'nome', headerName: 'Nome', width: 250 },
    { field: 'peso', headerName: 'Peso', width: 150 },
    { field: 'volume', headerName: 'Volume', width: 150 },
    {
      field: 'nivelDeRisco',
      headerName: 'Nível de Risco',
      width: 200,
      valueGetter: (params) => params.row.nivelDeRisco || params.row.nivel_de_risco
    }
  ];

  const rows = materiais.map(m => ({
    ...m,
    nivelDeRisco: m.nivelDeRisco || m.nivel_de_risco
  }));

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

      <div style={{ height: 500, width: '100%', marginBottom: 24 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={row => row.idMaterial || row.id_material}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          disableSelectionOnClick
          filterMode="client"
          autoHeight={false}
        />
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedMaterial ? 'Editar Material' : 'Novo Material'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-8">
                <Form.Group className="mb-3" style={{ minWidth: 300 }}>
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.nome}
                    onChange={e => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3" style={{ minWidth: 180 }}>
                  <Form.Label>Nível de Risco</Form.Label>
                  <Form.Select
                    value={formData.nivelDeRisco}
                    onChange={e => setFormData({ ...formData, nivelDeRisco: e.target.value })}
                    required
                  >
                    <option value="">Selecione o nível de risco</option>
                    <option value="baixo">Baixo</option>
                    <option value="medio">Médio</option>
                    <option value="alto">Alto</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" style={{ minWidth: 180 }}>
                  <Form.Label>Peso</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.peso}
                    onChange={e => setFormData({ ...formData, peso: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3" style={{ minWidth: 180 }}>
                  <Form.Label>Volume</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.volume}
                    onChange={e => setFormData({ ...formData, volume: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>
            </div>
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
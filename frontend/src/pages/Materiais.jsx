import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import endpoints from '../services/endpoints';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMateriais();
  }, []);

  const loadMateriais = async () => {
    setLoading(true);
    try {
      console.log('Iniciando carregamento de materiais...');
      const response = await endpoints.materiais.list();
      console.log('Resposta da API de materiais:', response);

      if (response?.data) {
        console.log('Dados dos materiais recebidos:', response.data);
        const materiaisFormatados = response.data.map(material => ({
          id: material.idMaterial,
          nome: material.nome,
          peso: material.peso,
          volume: material.volume,
          nivelDeRisco: material.nivelDeRisco
        }));
        console.log('Materiais formatados:', materiaisFormatados);
        setMateriais(materiaisFormatados);
      } else {
        console.log('Nenhum material recebido da API');
        setMateriais([]);
      }
    } catch (error) {
      console.error('Erro ao carregar materiais:', error);
      showAlert('Erro ao carregar materiais', 'danger');
      setMateriais([]);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let materialData;
      if (selectedMaterial) {
        // Atualizar apenas nome e nivelDeRisco
        materialData = {
          nome: formData.nome || '',
          nivelDeRisco: formData.nivelDeRisco || 'baixo'
        };
      } else {
        materialData = {
          nome: formData.nome || '',
          peso: formData.peso || 0,
          volume: formData.volume || 0,
          nivelDeRisco: formData.nivelDeRisco || 'baixo'
        };
      }

      if (selectedMaterial) {
        await endpoints.materiais.update(selectedMaterial.id || selectedMaterial.idMaterial, materialData);
        showAlert('Material atualizado com sucesso!', 'success');
      } else {
        await endpoints.materiais.create(materialData);
        showAlert('Material cadastrado com sucesso!', 'success');
      }

      await loadMateriais();
      handleCloseModal();
    } catch (error) {
      showAlert('Erro ao processar material', 'danger');
    }
  };

  const handleEdit = (material) => {
    setSelectedMaterial(material);
    setFormData({
      nome: material.nome || '',
      peso: material.peso || 0,
      volume: material.volume || 0,
      nivelDeRisco: material.nivelDeRisco || 'baixo'
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
    {
      field: 'nome',
      headerName: 'Nome',
      width: 200,
    },
    {
      field: 'peso',
      headerName: 'Peso (kg)',
      width: 120,
    },
    {
      field: 'volume',
      headerName: 'Volume (m³)',
      width: 120,
    },
    {
      field: 'nivelDeRisco',
      headerName: 'Nível de Risco',
      width: 120,
    }
    // Removido o campo 'acoes'
  ];

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h2>Materiais</h2>
        <div className="col-12 col-md-auto px-0 mt-2 mt-md-0">
          <Button
            variant="primary"
            className=" w-100"
            onClick={() => {
              setSelectedMaterial(null);
              setFormData({
                nome: '',
                peso: '',
                volume: '',
                nivelDeRisco: 'baixo'
              });
              setShowModal(true);
            }}
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Novo Material
          </Button>
        </div>
      </div>
      {alert.show && (
        <Alert
          variant={alert.variant}
          onClose={() => setAlert({ show: false })}
          dismissible
          className="position-fixed top-0 end-0 m-3"
          style={{ zIndex: 1050 }}
        >
          {alert.message}
        </Alert>
      )}

      <div style={{ width: '100%' }}>
        <DataGrid
          rows={materiais}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 5, page: 0 } }
          }}
          pageSizeOptions={[5]}
          pagination
          disableSelectionOnClick
          getRowId={(row) => row.id}
          checkboxSelection={false}
          isRowSelectable={() => false}
          loading={loading}
          autoHeight={true}
        />
      </div>

      {/* Removido o botão de editar do modal e da tabela */}
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
                    name="nome"
                    value={formData.nome}
                    onChange={e => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3 w-100">
                  <Form.Label>Nível de Risco</Form.Label>
                  <Form.Select
                    name="nivelDeRisco"
                    value={formData.nivelDeRisco}
                    onChange={e => setFormData({ ...formData, nivelDeRisco: e.target.value })}
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="Baixo">Baixo</option>
                    <option value="Medio">Médio</option>
                    <option value="Alto">Alto</option>
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
                    name="peso"
                    value={formData.peso}
                    onChange={e => setFormData({ ...formData, peso: e.target.value })}
                    required
                    disabled={!!selectedMaterial}
                    placeholder='Peso (kg)'
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3" style={{ minWidth: 180 }}>
                  <Form.Label>Volume</Form.Label>
                  <Form.Control
                    type="number"
                    name="volume"
                    value={formData.volume}
                    onChange={e => setFormData({ ...formData, volume: e.target.value })}
                    required
                    disabled={!!selectedMaterial}
                    placeholder='Volume (m³)'
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
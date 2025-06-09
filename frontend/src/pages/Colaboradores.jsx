import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { endpoints } from '../services/api';
import { DataGrid } from '@mui/x-data-grid';

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

  const columns = [
    { field: 'cpf', headerName: 'CPF', width: 180 },
    { field: 'nome', headerName: 'Nome', width: 250 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'telefone', headerName: 'Telefone', width: 180 },
    { field: 'sexo', headerName: 'Sexo', width: 150 },
    {
      field: 'dataAdmissao',
      headerName: 'Data de Admissão',
      width: 150,
      valueGetter: (params) =>
        params.row.dataAdmissao
          ? new Date(params.row.dataAdmissao).toLocaleDateString()
          : ''
    },
    { field: 'carga_horaria', headerName: 'Carga Horária', width: 150 },
    { field: 'nacionalidade', headerName: 'Nacionalidade', width: 200 },
    {
      field: 'cargo',
      headerName: 'Cargo',
      width: 180,
      valueGetter: (params) =>
        cargos.find(c => c.id === (params.row.id_cargo || params.row.cargo_id))?.nome || ''
    }
  ];

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

      <div style={{ height: 500, width: '100%', marginBottom: 24 }}>
        <DataGrid
          rows={colaboradores}
          columns={columns}
          getRowId={row => row.id}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          disableSelectionOnClick
          filterMode="client"
          autoHeight={false}
        />
      </div>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedColaborador ? 'Editar Colaborador' : 'Novo Colaborador'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <h6 className="mb-3 text-success">Dados Pessoais</h6>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" style={{ minWidth: 220 }}>
                  <Form.Label>CPF</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.cpf || ''}
                    onChange={e => setFormData({ ...formData, cpf: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3" style={{ minWidth: 220 }}>
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.nome || ''}
                    onChange={e => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" style={{ minWidth: 220 }}>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email || ''}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3" style={{ minWidth: 220 }}>
                  <Form.Label>Telefone</Form.Label>
                  <Form.Control
                    type="tel"
                    value={formData.telefone || ''}
                    onChange={e => setFormData({ ...formData, telefone: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" style={{ minWidth: 220 }}>
                  <Form.Label>Sexo</Form.Label>
                  <Form.Select
                    value={formData.sexo || ''}
                    onChange={e => setFormData({ ...formData, sexo: e.target.value })}
                    required
                  >
                    <option value="">Selecione o sexo</option>
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <h6 className="mb-3 text-success">Dados do Colaborador</h6>
            <div className="row">
              <div className="col-md-4">
                <Form.Group className="mb-3" style={{ minWidth: 180 }}>
                  <Form.Label>Data de Admissão</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.dataAdmissao || ''}
                    onChange={e => setFormData({ ...formData, dataAdmissao: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3" style={{ minWidth: 180 }}>
                  <Form.Label>Carga Horária</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.carga_horaria || ''}
                    onChange={e => setFormData({ ...formData, carga_horaria: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3" style={{ minWidth: 180 }}>
                  <Form.Label>Nacionalidade</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.nacionalidade || ''}
                    onChange={e => setFormData({ ...formData, nacionalidade: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" style={{ minWidth: 220 }}>
                  <Form.Label>Cargo</Form.Label>
                  <Form.Select
                    value={formData.id_cargo || ''}
                    onChange={e => setFormData({ ...formData, id_cargo: e.target.value })}
                    required
                  >
                    <option value="">Selecione o cargo</option>
                    {cargos.map((cargo) => (
                      <option key={cargo.id} value={cargo.id}>
                        {cargo.nome}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
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
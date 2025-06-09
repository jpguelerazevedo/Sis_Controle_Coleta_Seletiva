import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { endpoints } from '../services/api';
import { DataGrid } from '@mui/x-data-grid';

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

  const columns = [
    { field: 'cpf', headerName: 'CPF', width: 180 },
    { field: 'nome', headerName: 'Nome', width: 250 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'telefone', headerName: 'Telefone', width: 180 },
    { field: 'sexo', headerName: 'Sexo', width: 150 },
    { field: 'turno_preferido_de_coleta', headerName: 'Turno Preferido de Coleta', width: 180 },
    { field: 'frequencia_de_pedidos', headerName: 'Frequência de Pedidos', width: 180 },
    { field: 'rua', headerName: 'Rua', width: 200 },
    { field: 'numero', headerName: 'Número', width: 120 },
    { field: 'cep', headerName: 'CEP', width: 180 },
    { field: 'referencia', headerName: 'Referência', width: 300 },
    { field: 'bairro', headerName: 'Bairro', width: 200 }
  ];

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

      <div style={{ height: 500, width: '100%', marginBottom: 24 }}>
        <DataGrid
          rows={clientes}
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
            {selectedCliente ? 'Editar Cliente' : 'Novo Cliente'}
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
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
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
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3" style={{ minWidth: 220 }}>
                  <Form.Label>Telefone</Form.Label>
                  <Form.Control
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
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

            <h6 className="mb-3 text-success">Dados do Cliente</h6>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" style={{ minWidth: 220 }}>
                  <Form.Label>Turno Preferido de Coleta</Form.Label>
                  <Form.Select
                    value={formData.turno_preferido_de_coleta || ''}
                    onChange={e => setFormData({ ...formData, turno_preferido_de_coleta: e.target.value })}
                    required
                  >
                    <option value="">Selecione o turno</option>
                    <option value="manhã">Manhã</option>
                    <option value="tarde">Tarde</option>
                    <option value="noite">Noite</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <h6 className="mb-3 text-success">Endereço</h6>
            <div className="row">
              <div className="col-md-4">
                <Form.Group className="mb-3" style={{ minWidth: 220 }}>
                  <Form.Label>Rua</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.rua || ''}
                    onChange={e => setFormData({ ...formData, rua: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-2">
                <Form.Group className="mb-3" style={{ minWidth: 120 }}>
                  <Form.Label>Número</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.numero || ''}
                    onChange={e => setFormData({ ...formData, numero: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>

              <div className="col-md-3">
                <Form.Group className="mb-3" style={{ minWidth: 150 }}>
                  <Form.Label>CEP</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.cep || ''}
                    onChange={e => setFormData({ ...formData, cep: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-9">
                <Form.Group className="mb-3" style={{ minWidth: 150 }}>
                  <Form.Label>Referência</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.referencia || ''}
                    onChange={e => setFormData({ ...formData, referencia: e.target.value })}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" style={{ minWidth: 220 }}>
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
              </div>
            </div>

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
import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { endpoints } from '../services/api';
import { DataGrid } from '@mui/x-data-grid';

function PedidosColeta() {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [materiais, setMateriais] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [formData, setFormData] = useState({
    data_pedido: '',
    status: 'pendente',
    observacoes: '',
    id_cliente: '',
    tipo: '',
    peso: '',
    volume: '',
    idMaterial: ''
  });
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  useEffect(() => {
    loadPedidos();
    loadClientes();
    loadMateriais();
  }, []);

  const loadPedidos = async () => {
    try {
      const response = await endpoints.pedidosColeta.list();
      setPedidos(response.data);
    } catch (error) {
      showAlert('Erro ao carregar pedidos', 'danger');
    }
  };

  const loadClientes = async () => {
    try {
      const response = await endpoints.clientes.list();
      setClientes(response.data);
    } catch (error) {
      showAlert('Erro ao carregar clientes', 'danger');
    }
  };

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
      if (selectedPedido) {
        await endpoints.pedidosColeta.update(selectedPedido.id, formData);
        showAlert('Pedido atualizado com sucesso!', 'success');
      } else {
        await endpoints.pedidosColeta.create(formData);
        showAlert('Pedido cadastrado com sucesso!', 'success');
      }
      handleCloseModal();
      loadPedidos();
    } catch (error) {
      showAlert('Erro ao salvar pedido', 'danger');
    }
  };

  const handleEdit = (pedido) => {
    setSelectedPedido(pedido);
    setFormData({
      data_pedido: pedido.data_pedido,
      status: pedido.status,
      observacoes: pedido.observacoes,
      id_cliente: pedido.id_cliente,
      tipo: pedido.tipo,
      peso: pedido.peso,
      volume: pedido.volume,
      idMaterial: pedido.idMaterial
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este pedido?')) {
      try {
        await endpoints.pedidosColeta.delete(id);
        showAlert('Pedido excluído com sucesso!', 'success');
        loadPedidos();
      } catch (error) {
        showAlert('Erro ao excluir pedido', 'danger');
      }
    }
  };

  const handleStatusChange = async (id, novoStatus) => {
    try {
      const pedido = pedidos.find(p => p.id === id);
      await endpoints.pedidosColeta.update(id, { ...pedido, status: novoStatus });
      showAlert('Status atualizado com sucesso!', 'success');
      loadPedidos();
    } catch (error) {
      showAlert('Erro ao atualizar status', 'danger');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPedido(null);
    setFormData({
      data_pedido: '',
      status: 'pendente',
      observacoes: '',
      id_cliente: '',
      tipo: '',
      peso: '',
      volume: '',
      idMaterial: ''
    });
  };

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 3000);
  };

  const getStatusBadge = (status) => {
    const variants = {
      pendente: 'warning',
      em_andamento: 'info',
      concluido: 'success',
      cancelado: 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getClienteNome = (id) => {
    const cliente = clientes.find(c => c.id === id);
    return cliente ? cliente.nome : 'Cliente não encontrado';
  };

  const getMaterialNome = (id) => {
    const material = materiais.find(m => m.id === id);
    return material ? material.nome : 'Material não encontrado';
  };

  // Defina as colunas para o DataGrid
  const columns = [
    { field: 'data_pedido', headerName: 'Data', width: 150, valueGetter: (params) => params.row.data_pedido ? new Date(params.row.data_pedido).toLocaleDateString() : '' },
    { field: 'id_cliente', headerName: 'Cliente', width: 250, valueGetter: (params) => getClienteNome(params.row.id_cliente) },
    { field: 'idMaterial', headerName: 'Material', width: 250, valueGetter: (params) => getMaterialNome(params.row.idMaterial) },
    { field: 'tipo', headerName: 'Tipo', width: 200 },
    { field: 'peso', headerName: 'Peso (kg)', width: 150 },
    { field: 'volume', headerName: 'Volume (m³)', width: 150 },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Pedidos de Coleta</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Novo Pedido
        </Button>
      </div>

      {alert.show && (
        <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
          {alert.message}
        </Alert>
      )}

      <div style={{ height: 500, width: '100%', marginBottom: 24 }}>
        <DataGrid
          rows={pedidos}
          columns={columns}
          getRowId={row => row.id}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          disableSelectionOnClick
          filterMode="client"
          autoHeight={false}
        />
      </div>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedPedido ? 'Editar Pedido' : 'Novo Pedido de Coleta'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* Data */}
            <Form.Group className="mb-3">
              <Form.Label>Data</Form.Label>
              <Form.Control
                type="date"
                value={formData.data_pedido}
                onChange={e => setFormData({ ...formData, data_pedido: e.target.value })}
                required
              />
            </Form.Group>
            {/* Cliente */}
            <Form.Group className="mb-3">
              <Form.Label>Cliente</Form.Label>
              <Form.Select
                value={formData.id_cliente}
                onChange={e => setFormData({ ...formData, id_cliente: e.target.value })}
                required
              >
                <option value="">Selecione um cliente</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nome} ({cliente.cpf})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {/* Material */}
            <Form.Group className="mb-3">
              <Form.Label>Material</Form.Label>
              <Form.Select
                value={formData.idMaterial}
                onChange={e => setFormData({ ...formData, idMaterial: e.target.value })}
                required
              >
                <option value="">Selecione um material</option>
                {materiais.map(material => (
                  <option key={material.id} value={material.id}>
                    {material.nome}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {/* Tipo */}
            <Form.Group className="mb-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Control
                type="text"
                value={formData.tipo}
                onChange={e => setFormData({ ...formData, tipo: e.target.value })}
                required
              />
            </Form.Group>
            {/* Peso */}
            <Form.Group className="mb-3">
              <Form.Label>Peso (kg)</Form.Label>
              <Form.Control
                type="number"
                step="0.1"
                value={formData.peso}
                onChange={e => setFormData({ ...formData, peso: e.target.value })}
                required
              />
            </Form.Group>
            {/* Volume */}
            <Form.Group className="mb-3">
              <Form.Label>Volume (m³)</Form.Label>
              <Form.Control
                type="number"
                step="0.1"
                value={formData.volume}
                onChange={e => setFormData({ ...formData, volume: e.target.value })}
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                {selectedPedido ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default PedidosColeta;
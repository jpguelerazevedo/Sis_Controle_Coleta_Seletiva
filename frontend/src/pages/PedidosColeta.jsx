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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState(''); // 'cancel' ou 'edit'
  const [formData, setFormData] = useState({
    cpfCliente: '',
    cpfColaborador: '',
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
      console.log('Carregando pedidos...');
      const response = await endpoints.pedidosColeta.list();
      console.log('Resposta da API:', response);
      
      if (response && response.data) {
        const pedidosFormatados = response.data.map(pedido => ({
          idPedido: pedido.idPedido,
          idMaterial: pedido.idMaterial,
          tipo: pedido.tipo,
          peso: pedido.peso,
          volume: pedido.volume,
          cpfCliente: pedido.cpf_cliente,
          cpfColaborador: pedido.cpf_colaborador,
          data_pedido: pedido.data_pedido,
          status: pedido.status
        }));
        console.log('Pedidos formatados:', pedidosFormatados);
        setPedidos(pedidosFormatados);
      } else {
        console.error('Resposta da API inválida:', response);
        setPedidos([]);
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      showAlert('Erro ao carregar pedidos: ' + error.message, 'danger');
      setPedidos([]);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cpfCliente' || name === 'cpfColaborador') {
      const cpfNumerico = value.replace(/\D/g, '').slice(0, 11);
      setFormData({
        ...formData,
        [name]: cpfNumerico
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Encontra o material selecionado
      const materialSelecionado = materiais.find(m => m.idMaterial === parseInt(formData.idMaterial));
      if (!materialSelecionado) {
        showAlert('Material não encontrado', 'danger');
        return;
      }

      const pedidoData = {
        cpfCliente: formData.cpfCliente,
        cpfColaborador: formData.cpfColaborador,
        peso: parseFloat(formData.peso),
        volume: parseFloat(formData.volume),
        idMaterial: parseInt(formData.idMaterial),
        tipo: materialSelecionado.nome
      };

      await endpoints.pedidosColeta.create(pedidoData);
      showAlert('Pedido registrado com sucesso!', 'success');
      handleCloseModal();
      loadPedidos();
    } catch (error) {
      console.error('Erro ao salvar pedido:', error);
      showAlert('Erro ao salvar pedido: ' + error.message, 'danger');
    }
  };

  const handleEdit = (pedido) => {
    setSelectedPedido(pedido);
    setFormData({
      data_pedido: pedido.data_pedido,
      status: pedido.status,
      observacoes: pedido.observacoes || '',
      cpfCliente: pedido.cpf_cliente,
      cpfColaborador: pedido.cpf_colaborador,
      peso: pedido.peso,
      volume: pedido.volume,
      idMaterial: pedido.idMaterial
    });
    setShowModal(true);
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
    setFormData({
      cpfCliente: '',
      cpfColaborador: '',
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

  const handleCancelPedido = async (pedido) => {
    try {
      await endpoints.pedidosColeta.update(pedido.idPedido, {
        ...pedido,
        status: 'cancelado'
      });
      showAlert('Pedido cancelado com sucesso!', 'success');
      loadPedidos();
    } catch (error) {
      console.error('Erro ao cancelar pedido:', error);
      showAlert('Erro ao cancelar pedido: ' + error.message, 'danger');
    }
  };

  const handleEditPedido = (pedido) => {
    setSelectedPedido(pedido);
    setFormData({
      data_pedido: pedido.data_pedido,
      status: pedido.status,
      observacoes: pedido.observacoes || '',
      cpfCliente: pedido.cpf_cliente,
      cpfColaborador: pedido.cpf_colaborador,
      peso: pedido.peso,
      volume: pedido.volume,
      idMaterial: pedido.idMaterial
    });
    setShowModal(true);
  };

  const handleConfirmAction = async () => {
    try {
      if (actionType === 'cancel') {
        await endpoints.pedidosColeta.update(selectedPedido.idPedido, {
          ...selectedPedido,
          status: 'cancelado'
        });
        showAlert('Pedido cancelado com sucesso!', 'success');
      }
      setShowConfirmModal(false);
      loadPedidos();
    } catch (error) {
      console.error('Erro ao executar ação:', error);
      showAlert('Erro ao executar ação: ' + error.message, 'danger');
    }
  };

  const handleDelete = async (pedido) => {
    try {
      console.log('Excluindo pedido:', pedido.idPedido);
      await endpoints.pedidosColeta.delete(pedido.idPedido);
      showAlert('Pedido excluído com sucesso!', 'success');
      loadPedidos();
    } catch (error) {
      console.error('Erro ao excluir pedido:', error);
      showAlert('Erro ao excluir pedido: ' + error.message, 'danger');
    }
  };

  // Defina as colunas para o DataGrid
  const columns = [
    { field: 'idPedido', headerName: 'ID', width: 70 },
    { 
      field: 'idMaterial',
      headerName: 'Material',
      width: 200,
      valueGetter: (params) => {
        try {
          if (!params || !params.row || !params.row.idMaterial) return '';
          const material = materiais.find(m => m.idMaterial === params.row.idMaterial);
          return material ? material.nome : params.row.tipo || '';
        } catch (error) {
          console.error('Erro ao buscar material:', error);
          return params.row.tipo || '';
        }
      }
    },
    { field: 'peso', headerName: 'Peso (kg)', width: 130 },
    { field: 'volume', headerName: 'Volume (m³)', width: 130 },
    { field: 'cpfCliente', headerName: 'Cliente', width: 130 },
    { field: 'cpfColaborador', headerName: 'Colaborador', width: 130 },
  
  ];

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Pedidos de Coleta</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-circle me-2"></i>
          Novo Pedido
        </Button>
      </div>

      {alert.show && (
        <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
          {alert.message}
        </Alert>
      )}

      {pedidos.length === 0 ? (
        <div className="text-center">
          <p>Nenhum pedido encontrado.</p>
        </div>
      ) : (
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={pedidos}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            disableSelectionOnClick
            getRowId={(row) => row.idPedido || row.id_pedido}
            sx={{
              height: 400,
              width: '100%',
              '& .MuiDataGrid-cell:focus': {
                outline: 'none'
              }
            }}
          />
        </div>
      )}

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedPedido ? 'Editar Pedido' : 'Novo Pedido de Coleta'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Material</Form.Label>
              <Form.Select
                name="idMaterial"
                value={formData.idMaterial}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecione um material</option>
                {materiais.map((material) => (
                  <option key={material.idMaterial} value={material.idMaterial}>
                    {material.nome}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>CPF do Cliente</Form.Label>
              <Form.Control
                type="text"
                name="cpfCliente"
                value={formData.cpfCliente}
                onChange={handleInputChange}
                required
                pattern="\d{11}"
                title="Digite um CPF válido (11 dígitos)"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>CPF do Colaborador</Form.Label>
              <Form.Control
                type="text"
                name="cpfColaborador"
                value={formData.cpfColaborador}
                onChange={handleInputChange}
                required
                pattern="\d{11}"
                title="Digite um CPF válido (11 dígitos)"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Peso (kg)</Form.Label>
              <Form.Control
                type="number"
                name="peso"
                value={formData.peso}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Volume (m³)</Form.Label>
              <Form.Control
                type="number"
                name="volume"
                value={formData.volume}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
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

      {/* Modal de Confirmação */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Ação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {actionType === 'cancel' ? (
            <p>Tem certeza que deseja cancelar este pedido?</p>
          ) : (
            <p>Tem certeza que deseja editar este pedido?</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Não
          </Button>
          <Button variant="primary" onClick={handleConfirmAction}>
            Sim
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PedidosColeta;
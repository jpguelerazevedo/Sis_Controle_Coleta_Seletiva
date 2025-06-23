import React, { useState, useEffect } from 'react';
import { Container, Button, Form, Modal, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import endpoints from '../services/endpoints';
import { DataGrid } from '@mui/x-data-grid';

function PedidosColeta() {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [materiais, setMateriais] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [formData, setFormData] = useState({
    peso: '',
    volume: '',
    idMaterial: '',
    cpfCliente: '',
    cpfColaborador: '',
    tipo: ''
  });
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const [loading, setLoading] = useState(true); // Adicionado estado loading

  useEffect(() => {
    loadPedidos();
    loadClientes();
    loadMateriais();
    loadColaboradores();
  }, []);

  const loadPedidos = async () => {
    setLoading(true); // Inicia loading
    try {
      const response = await endpoints.pedidos.list();
      if (response && response.data) {
        const pedidosFormatados = response.data.map(pedido => ({
          id: pedido.idPedido || pedido.id_pedido,
          idPedido: pedido.idPedido || pedido.id_pedido,
          peso: pedido.peso,
          volume: pedido.volume,
          idMaterial: pedido.idMaterial,
          cpfCliente: pedido.cpf_cliente,
          cpfColaborador: pedido.cpf_colaborador,
          data: pedido.data,
          status: pedido.status,
          tipo: pedido.tipo,// Garante que tipo seja sempre uma string
        }));
        setPedidos(pedidosFormatados);
      } else {
        setPedidos([]);
      }
    } catch (error) {
      showAlert('Erro ao carregar pedidos: ' + error.message, 'danger');
      setPedidos([]);
    }
    setLoading(false); // Finaliza loading
  };

  const loadClientes = async () => {
    try {
      const response = await endpoints.clientes.list();
      setClientes(response.data || []);
    } catch (error) {
      showAlert('Erro ao carregar clientes', 'danger');
    }
  };

  const loadMateriais = async () => {
    try {
      const response = await endpoints.materiais.list();
      setMateriais(response.data || []);
    } catch (error) {
      showAlert('Erro ao carregar materiais', 'danger');
    }
  };

  const loadColaboradores = async () => {
    try {
      const response = await endpoints.colaboradores.list();
      setColaboradores(response.data || []);
    } catch (error) {
      showAlert('Erro ao carregar colaboradores', 'danger');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const materialSelecionado = materiais.find(m => m.idMaterial === parseInt(formData.idMaterial));
      if (!materialSelecionado) {
        showAlert('Material não encontrado', 'danger');
        return;
      }
      // Inclui o campo data ao salvar
      const pedidoData = {
        peso: parseFloat(formData.peso),
        volume: parseFloat(formData.volume),
        idMaterial: parseInt(formData.idMaterial),
        cpfCliente: String(formData.cpfCliente),
        cpfColaborador: String(formData.cpfColaborador),
        tipo: String(formData.tipo),
        data: formData.data ? new Date(formData.data) : new Date()
      };
      if (selectedPedido) {
        await endpoints.pedidos.update(selectedPedido.idPedido, pedidoData);
        showAlert('Pedido atualizado com sucesso!', 'success');
      } else {
        await endpoints.pedidos.create(pedidoData);
        showAlert('Pedido registrado com sucesso!', 'success');
      }
      handleCloseModal();
      loadPedidos();
    } catch (error) {
      showAlert('Erro ao salvar pedido: ' + error.message, 'danger');
    }
  };

  // Ensure all form fields are always defined (never undefined)
  const safeValue = (val) => (val !== undefined && val !== null ? val : '');

  const handleEdit = (pedido) => {
    setSelectedPedido(pedido);
    setFormData({
      peso: safeValue(pedido.peso),
      volume: safeValue(pedido.volume),
      idMaterial: safeValue(pedido.idMaterial),
      cpfCliente: safeValue(pedido.cpfCliente),
      cpfColaborador: safeValue(pedido.cpfColaborador),
      tipo: safeValue(pedido.tipo)
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPedido(null);
    setFormData({
      peso: '',
      volume: '',
      idMaterial: '',
      cpfCliente: '',
      cpfColaborador: '',
      tipo: ''
    });
  };

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 3000);
  };

  const columns = [
    {
      field: 'idMaterial',
      headerName: 'Material',
      width: 200,
      renderCell: (params) => {
        const idMaterial = params.row.idMaterial;
        const material = materiais.find(m => String(m.idMaterial) === String(idMaterial));
        return material ? material.nome : '';
      }
    },
    { field: 'peso', headerName: 'Peso (kg)', width: 120 },
    { field: 'volume', headerName: 'Volume (m³)', width: 120 },
    { field: 'cpfCliente', headerName: 'Cliente', width: 150 },
    { field: 'cpfColaborador', headerName: 'Colaborador', width: 150 },
  ];

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Pedidos de Coleta</h2>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedPedido(null);
            setFormData({
              peso: '',
              volume: '',
              idMaterial: '',
              cpfCliente: '',
              cpfColaborador: ''
            });
            setShowModal(true);
          }}
          className="mb-3"
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Novo Pedido
        </Button>
      </div>
      {alert.show && (
        <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
          {alert.message}
        </Alert>
      )}
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={pedidos}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          autoHeight
          getRowId={row => row.idPedido || row.id_pedido || row.id}
          isRowSelectable={() => false}
          disableVirtualization
          loading={loading}
        />
      </div>
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedPedido ? 'Editar Pedido' : 'Novo Pedido de Coleta'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* Linha 1: Material e Estado do Material */}
            <div className="row">
              <div className="col-md-7">
                <Form.Group className="mb-3">
                  <Form.Label>Material</Form.Label>
                  <Form.Select
                    name="idMaterial"
                    value={safeValue(formData.idMaterial)}
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
              </div>
            </div>
            {/* Linha 2: Peso e Volume */}
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Peso</Form.Label>
                  <Form.Control
                    type="number"
                    name="peso"
                    value={safeValue(formData.peso)}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder='Peso (kg)'
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Volume</Form.Label>
                  <Form.Control
                    type="number"
                    name="volume"
                    value={safeValue(formData.volume)}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder='Volume (m³)'
                  />
                </Form.Group>
              </div>
            </div>
            {/* Linha 3: Cliente e Colaborador */}
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>CPF do Cliente</Form.Label>
                  <Form.Select
                    name="cpfCliente"
                    value={safeValue(formData.cpfCliente)}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione o cliente</option>
                    {clientes.map((cliente) => (
                      <option key={cliente.cpf} value={cliente.cpf}>
                        {(cliente.nome || (cliente.pessoa && cliente.pessoa.nome) || '') + ' - ' + cliente.cpf}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>CPF do Colaborador</Form.Label>
                  <Form.Select
                    name="cpfColaborador"
                    value={safeValue(formData.cpfColaborador)}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione o colaborador</option>
                    {colaboradores.map((colab) => (
                      <option key={colab.cpf} value={colab.cpf}>
                        {(colab.nome || (colab.pessoa && colab.pessoa.nome) || '') + ' - ' + colab.cpf}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
            {/* Botões */}
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
    </Container>
  );
}

export default PedidosColeta;
import React, { useState, useEffect } from 'react';
import { Container, Button, Form, Modal, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import endpoints from '../../services/endpoints';
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
  const [alert, setAlert] = useState({ show: false, message: '', variant: '', modal: false });
  const [loading, setLoading] = useState(true); // Adicionado estado loading

  useEffect(() => {
    // Carrega clientes, materiais e colaboradores antes de pedidos
    const fetchAll = async () => {
      await loadClientes();
      await loadMateriais();
      await loadColaboradores();
    };
    fetchAll();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Só carrega pedidos depois que todos os dados dependentes estiverem carregados
    if (clientes.length > 0 && materiais.length > 0 && colaboradores.length > 0) {
      loadPedidos();
    }
    // eslint-disable-next-line
  }, [clientes, materiais, colaboradores]);

  const loadPedidos = async () => {
    setLoading(true);
    try {
      const response = await endpoints.pedidos.list();
      if (response && response.data) {
        const pedidosFormatados = response.data.map((pedido, idx) => {
          // Busca nomes já no carregamento para facilitar filtro e exibição
          const material = materiais.find(m => String(m.idMaterial) === String(pedido.idMaterial));
          const cliente = clientes.find(c => String(c.cpf) === String(pedido.cpf_cliente));
          const colab = colaboradores.find(c => String(c.cpf) === String(pedido.cpf_colaborador));
          let rawData = pedido.dataPedido || pedido.data_pedido || pedido.data || pedido.createdAt || pedido.updatedAt || '';
          let dataFormatada = '';
          let horaFormatada = '';
          let createdAt = pedido.createdAt || pedido.dataPedido || pedido.data_pedido || pedido.data || pedido.updatedAt || '';
          if (rawData) {
            const dateObj = new Date(rawData);
            if (!isNaN(dateObj)) {
              const dia = String(dateObj.getDate()).padStart(2, '0');
              const mes = String(dateObj.getMonth() + 1).padStart(2, '0');
              const ano = dateObj.getFullYear();
              dataFormatada = `${dia}/${mes}/${ano}`;
              const hora = String(dateObj.getHours()).padStart(2, '0');
              const min = String(dateObj.getMinutes()).padStart(2, '0');
              const seg = String(dateObj.getSeconds()).padStart(2, '0');
              horaFormatada = `${hora}:${min}:${seg}`;
            } else {
              dataFormatada = rawData;
              horaFormatada = '';
            }
          }
          return {
            id: pedido.idPedido || pedido.id_pedido || idx,
            idPedido: pedido.idPedido || pedido.id_pedido,
            peso: pedido.peso,
            volume: pedido.volume,
            idMaterial: pedido.idMaterial,
            materialNome: material ? material.nome : '',
            cpfCliente: pedido.cpf_cliente,
            clienteNome: cliente ? (cliente.nome || (cliente.pessoa && cliente.pessoa.nome) || '') : '',
            cpfColaborador: pedido.cpf_colaborador,
            colaboradorNome: colab ? (colab.nome || (colab.pessoa && colab.pessoa.nome) || '') : '',
            status: pedido.status,
            tipo: pedido.tipo,
            data: dataFormatada,
            hora: horaFormatada,
            createdAt: createdAt
          };
        });
        setPedidos(pedidosFormatados);
      } else {
        setPedidos([]);
      }
    } catch (error) {
      showAlert('Erro ao carregar pedidos: ' + error.message, 'danger');
      setPedidos([]);
    }
    setLoading(false);
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
    let hadError = false;
    try {
      const materialSelecionado = materiais.find(m => m.idMaterial === parseInt(formData.idMaterial));
      if (!materialSelecionado) {
        showAlert('Material não encontrado', 'danger', true);
        hadError = true;
        return;
      }
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
        try {
          await endpoints.pedidos.update(selectedPedido.idPedido, pedidoData);
          showAlert('Pedido atualizado com sucesso!', 'success');
        } catch (updateError) {
          let backendMsg = updateError?.response?.data?.error || updateError?.response?.data?.message || updateError.message || 'Erro ao atualizar pedido';
          showAlert(backendMsg, 'danger', true);
          hadError = true;
        }
      } else {
        try {
          await endpoints.pedidos.create(pedidoData);
          showAlert('Pedido registrado com sucesso!', 'success');
        } catch (createError) {
          let backendMsg = createError?.response?.data?.error || createError?.response?.data?.message || createError.message || 'Erro ao cadastrar pedido';
          showAlert(backendMsg, 'danger', true);
          hadError = true;
        }
      }
      if (!hadError) {
        handleCloseModal();
      }
      loadPedidos();
    } catch (error) {
      let backendMsg = error?.response?.data?.error || error?.response?.data?.message || error.message || 'Erro ao salvar pedido';
      showAlert(backendMsg, 'danger', true);
      // Não fecha o modal em caso de erro!
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

  const showAlert = (message, variant, modal = false) => {
    setAlert({ show: true, message, variant, modal });
    setTimeout(() => setAlert({ show: false, message: '', variant: '', modal: false }), 3000);
  };

  // Função para formatar CPF
  const formatCPFTable = (cpf) => {
    if (!cpf) return '';
    const cpfNumerico = cpf.replace(/\D/g, '');
    if (cpfNumerico.length !== 11) return cpf;
    return `${cpfNumerico.substring(0, 3)}.${cpfNumerico.substring(3, 6)}.${cpfNumerico.substring(6, 9)}-${cpfNumerico.substring(9, 11)}`;
  };

  // Função para formatar data
  const formatDataTable = (data) => {
    if (!data) return '';
    const dateObj = new Date(data);
    if (isNaN(dateObj)) return data;
    const dia = String(dateObj.getDate()).padStart(2, '0');
    const mes = String(dateObj.getMonth() + 1).padStart(2, '0');
    const ano = dateObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  // Função para buscar o valor do campo pelo nome ao filtrar na tabela
  function getColumnValue(row, field) {
    if (field === 'idMaterial') {
      const material = materiais.find(m => String(m.idMaterial) === String(row.idMaterial));
      return material ? material.nome : '';
    }
    if (field === 'clienteNome') {
      const cliente = clientes.find(c => String(c.cpf) === String(row.cpfCliente));
      return cliente ? (cliente.nome || (cliente.pessoa && cliente.pessoa.nome) || '') : '';
    }
    if (field === 'colaboradorNome') {
      const colab = colaboradores.find(c => String(c.cpf) === String(row.cpfColaborador));
      return colab ? (colab.nome || (colab.pessoa && colab.pessoa.nome) || '') : '';
    }
    return row[field];
  }

  const columns = [
    {
      field: 'materialNome',
      headerName: 'Material',
      width: 200,
      filterable: true,
    },
    { field: 'peso', headerName: 'Peso (kg)', width: 120 },
    { field: 'volume', headerName: 'Volume (m³)', width: 120 },
    {
      field: 'clienteNome',
      headerName: 'Cliente',
      width: 200,
      filterable: true,
    },
    {
      field: 'cpfCliente',
      headerName: 'CPF Cliente',
      width: 130,
      renderCell: (params) => formatCPFTable(params.value),
    },
    {
      field: 'colaboradorNome',
      headerName: 'Colaborador',
      width: 200,
      filterable: true,
    },
    {
      field: 'cpfColaborador',
      headerName: 'CPF Colaborador',
      width: 130,
      renderCell: (params) => formatCPFTable(params.value),
    },
    { field: 'data', headerName: 'Data', width: 100 },
    { field: 'hora', headerName: 'Hora', width: 90 }
  ];

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h2>Pedido de Coleta</h2>
        <div className="col-12 col-md-auto px-0 mt-2 mt-md-0">
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
            className="w-100"
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Novo Pedido
          </Button>
        </div>
      </div>
      <div style={{ width: '100%', marginBottom: 24 }}>
        <DataGrid
          rows={[...pedidos].sort((a, b) => {
            // Ordena por createdAt desc (mais recente primeiro)
            if (!a.createdAt) return 1;
            if (!b.createdAt) return -1;
            return new Date(b.createdAt) - new Date(a.createdAt);
          })}
          columns={columns}
          getRowId={row => row.id_pedidos || row.idPedido || row.id}
          initialState={{
            pagination: { paginationModel: { pageSize: 5, page: 0 } }
          }}
          pageSizeOptions={[5]}
          pagination
          disableSelectionOnClick
          isRowSelectable={() => false}
          loading={loading}
          autoHeight={true}
        />
      </div>


      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedPedido ? 'Editar Pedido' : 'Novo Pedido de Coleta'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Mostra alerta dentro do modal se erro ao cadastrar */}
          {alert.show && alert.modal && (
            <Alert
              variant={alert.variant}
              onClose={() => setAlert({ show: false, message: '', variant: '', modal: false })}
              dismissible
              className="mb-3"
            >
              {alert.message}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            {/* Linha 1: Material e Estado do Material */}
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Material</Form.Label>
                  <Form.Select
                    name="idMaterial"
                    value={safeValue(formData.idMaterial)}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione...</option>
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
                    <option value="">Selecione...</option>
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
                    <option value="">Selecione... </option>
                    {colaboradores
                      .filter(colab => {
                        // Considera ativo se status/status_colaborador contém "ativo" (case-insensitive)
                        const status = (colab.status ?? colab.status_colaborador ?? colab.estado ?? '').toString().trim().toUpperCase();
                        return status.includes('ATIVO');
                      })
                      .map((colab) => (
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
      {/* Alerta global só aparece se não for modal */}
      {alert.show && !alert.modal && (
        <Alert
          variant={alert.variant}
          onClose={() => setAlert({ show: false, message: '', variant: '', modal: false })}
          dismissible
          className="position-fixed top-0 end-0 m-3"
          style={{ zIndex: 1050 }}
        >
          {alert.message}
        </Alert>
      )}
    </Container>
  );
}

export default PedidosColeta;
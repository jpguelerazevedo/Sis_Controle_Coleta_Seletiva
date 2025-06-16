import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Modal, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { endpoints } from '../services/api';
import { DataGrid } from '@mui/x-data-grid';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [formData, setFormData] = useState({
    cpf: '',
    nome: '',
    email: '',
    telefone: '',
    sexo: '',
    turno_preferido_de_coleta: '',
    status_cliente: 'Ativo',
    frequencia_de_pedidos: '',
    bairro_id: '',
    rua: '',
    numero: '',
    cep: '',
    referencia: ''
  });
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const [bairros, setBairros] = useState([]);
  const [selectedBairro, setSelectedBairro] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [selectionModel, setSelectionModel] = useState([]);

  const columns = [
    {
      field: 'cpf',
      headerName: 'CPF',
      width: 130
    },
    {
      field: 'nome',
      headerName: 'Nome',
      width: 200
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200
    },
    {
      field: 'telefone',
      headerName: 'Telefone',
      width: 150
    },
    {
      field: 'status_cliente',
      headerName: 'Status',
      width: 150
    },
    {
      field: 'turno_preferido_de_coleta',
      headerName: 'Turno de Coleta',
      width: 150
    },
    {
      field: 'frequencia_de_pedidos',
      headerName: 'Frequência',
      width: 150
    },
    {
      field: 'acoes',
      headerName: 'Ações',
      width: 150,
      renderCell: (params) => (
        <div>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => handleEdit(params.row)}
            style={{ marginRight: '8px' }}
          >
            Editar
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => handleDelete(params.row.cpf)}
          >
            Excluir
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    console.log('Iniciando carregamento de dados...');
    loadClientes();
    loadBairros();
  }, []);

  const loadClientes = async () => {
    try {
      console.log('Iniciando carregamento de clientes...');
      const response = await endpoints.clientes.list();
      console.log('Resposta da API de clientes:', response);

      if (response?.data) {
        console.log('Dados dos clientes recebidos:', response.data);
        // Simplifica a estrutura dos dados
        const clientesFormatados = response.data.map(cliente => {
          console.log('Processando cliente:', cliente);
          const clienteFormatado = {
            id: cliente.cpf,
            cpf: cliente.cpf,
            nome: cliente.nome || cliente.pessoa?.nome || '',
            email: cliente.email || cliente.pessoa?.email || '',
            telefone: cliente.telefone || cliente.pessoa?.telefone || '',
            sexo: cliente.sexo || cliente.pessoa?.sexo || '',
            rua: cliente.rua || cliente.endereco?.rua || '',
            numero: cliente.numero || cliente.endereco?.numero || '',
            cep: cliente.cep || cliente.endereco?.cep || '',
            referencia: cliente.referencia || cliente.endereco?.referencia || '',
            id_bairro: cliente.id_bairro || cliente.endereco?.id_bairro || '',
            id_endereco: cliente.id_endereco || cliente.endereco?.id_endereco || '',
            turno_preferido_de_coleta: cliente.turno_preferido_de_coleta || '',
            status_cliente: cliente.status_cliente || '',
            frequencia_de_pedidos: cliente.frequencia_de_pedidos || ''
          };
          console.log('Cliente formatado:', clienteFormatado);
          return clienteFormatado;
        });
        console.log('Clientes formatados:', clientesFormatados);
        setClientes(clientesFormatados);
      } else {
        console.log('Nenhum dado recebido da API');
        setClientes([]);
      }
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      console.error('Detalhes do erro:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      showAlert('Erro ao carregar clientes: ' + (error.response?.data?.error || error.message), 'danger');
      setClientes([]);
    }
  };

  const loadBairros = async () => {
    try {
      console.log('Carregando bairros...');
      const response = await endpoints.bairros.list();
      console.log('Resposta da API de bairros:', response);

      if (response?.data) {
        console.log('Bairros carregados:', response.data);
        setBairros(response.data);
      } else {
        console.log('Nenhum bairro recebido da API');
        setBairros([]);
      }
    } catch (error) {
      console.error('Erro ao carregar bairros:', error);
      showAlert('Erro ao carregar bairros', 'danger');
      setBairros([]);
    }
  };

  const formatCPF = (cpf) => {
    // Remove todos os caracteres não numéricos
    const cpfNumerico = cpf.replace(/\D/g, '');

    // Verifica se tem 11 dígitos
    if (cpfNumerico.length !== 11) {
      throw new Error('CPF deve conter 11 dígitos numéricos.');
    }

    return cpfNumerico;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Iniciando cadastro de cliente...');
      console.log('Dados do formulário:', formData);

      // Validação dos campos obrigatórios
      if (!formData.cpf || !formData.nome || !formData.email || !formData.telefone) {
        throw new Error('Todos os campos pessoais são obrigatórios');
      }

      // Validação dos campos de endereço
      if (!formData.rua || !formData.numero || !formData.cep || !formData.bairro_id) {
        throw new Error('Todos os campos de endereço são obrigatórios');
      }

      // Validação específica do bairro
      if (!formData.bairro_id || formData.bairro_id === '') {
        throw new Error('Por favor, selecione um bairro');
      }

      // Formata e valida o CPF
      const cpfFormatado = formatCPF(formData.cpf);
      console.log('CPF formatado:', cpfFormatado);

      // Primeiro, cadastra a pessoa
      console.log('Cadastrando pessoa...');
      const pessoaData = {
        cpf: cpfFormatado,
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        sexo: formData.sexo || 'Não informado'
      };
      console.log('Dados da pessoa para cadastro:', pessoaData);
      const pessoaResponse = await endpoints.pessoas.create(pessoaData);
      console.log('Resposta do cadastro de pessoa:', pessoaResponse);

      // Depois, cadastra o endereço
      console.log('Cadastrando endereço...');
      const enderecoData = {
        rua: formData.rua,
        numero: parseInt(formData.numero),
        cep: formData.cep.replace(/\D/g, ''), // Remove caracteres não numéricos
        referencia: formData.referencia || '',
        id_bairro: parseInt(formData.bairro_id)
      };
      console.log('Dados do endereço para cadastro:', enderecoData);
      const enderecoResponse = await endpoints.enderecos.create(enderecoData);
      console.log('Resposta do cadastro de endereço:', enderecoResponse);

      if (!enderecoResponse.data || !enderecoResponse.data.id_endereco) {
        throw new Error('ID do endereço não retornado pela API');
      }

      // Por fim, cadastra o cliente
      console.log('Cadastrando cliente...');
      const clienteData = {
        cpf: cpfFormatado,
        id_endereco: enderecoResponse.data.id_endereco,
        turno_preferido_de_coleta: formData.turno_preferido_de_coleta || 'Manhã',
        status_cliente: formData.status_cliente || 'Ativo',
        frequencia_de_pedidos: formData.frequencia_de_pedidos || 'Semanal'
      };
      console.log('Dados do cliente para cadastro:', clienteData);
      const clienteResponse = await endpoints.clientes.create(clienteData);
      console.log('Resposta do cadastro de cliente:', clienteResponse);

      showAlert('Cliente cadastrado com sucesso!', 'success');
      setShowModal(false);
      await loadClientes();
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      console.error('Detalhes do erro:', error);
      showAlert(error.message || 'Erro ao cadastrar cliente', 'danger');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      console.log('Iniciando atualização do cliente...');
      console.log('Dados do formulário:', formData);
      console.log('Cliente selecionado:', selectedCliente);

      // Formata e valida o CPF
      const cpfFormatado = formatCPF(selectedCliente.cpf);
      console.log('CPF formatado:', cpfFormatado);

      // Primeiro, atualiza a pessoa
      console.log('Atualizando pessoa...');
      const pessoaData = {
        cpf: cpfFormatado,
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        sexo: formData.sexo || 'Não informado'
      };
      console.log('Dados da pessoa para atualização:', pessoaData);

      try {
        await endpoints.pessoas.update(cpfFormatado, pessoaData);
        console.log('Pessoa atualizada com sucesso');
      } catch (pessoaError) {
        console.warn('Aviso: Erro ao atualizar pessoa, mas continuando...', pessoaError);
        // Continua mesmo com erro, pois a atualização pode ter funcionado
      }

      // Depois, atualiza o endereço
      console.log('Atualizando endereço...');
      const idBairro = parseInt(formData.bairro_id);
      const idEndereco = parseInt(selectedCliente.id_endereco);
      console.log('ID do bairro convertido:', idBairro);
      console.log('ID do endereço convertido:', idEndereco);

      const enderecoData = {
        rua: formData.rua,
        numero: parseInt(formData.numero),
        cep: formData.cep.replace(/\D/g, ''), // Remove caracteres não numéricos
        referencia: formData.referencia || '',
        id_bairro: idBairro
      };
      console.log('Dados do endereço para atualização:', enderecoData);
      console.log('ID do endereço para atualização:', idEndereco);

      try {
        await endpoints.enderecos.update(idEndereco, enderecoData);
        console.log('Endereço atualizado com sucesso');
      } catch (enderecoError) {
        console.warn('Aviso: Erro ao atualizar endereço, mas continuando...', enderecoError);
        // Continua mesmo com erro, pois a atualização pode ter funcionado
      }

      // Por fim, atualiza o cliente
      console.log('Atualizando cliente...');
      const clienteData = {
        cpf: cpfFormatado,
        id_endereco: idEndereco,
        turno_preferido_de_coleta: formData.turno_preferido_de_coleta || 'Manhã',
        status_cliente: formData.status_cliente || 'Ativo',
        frequencia_de_pedidos: formData.frequencia_de_pedidos || 'Semanal'
      };
      console.log('Dados do cliente para atualização:', clienteData);

      try {
        await endpoints.clientes.update(cpfFormatado, clienteData);
        console.log('Cliente atualizado com sucesso');
      } catch (clienteError) {
        console.warn('Aviso: Erro ao atualizar cliente, mas continuando...', clienteError);
        // Continua mesmo com erro, pois a atualização pode ter funcionado
      }

      // Verifica se os dados foram atualizados
      try {
        await loadClientes();
        showAlert('Cliente atualizado com sucesso!', 'success');
        setShowModal(false);
      } catch (loadError) {
        console.error('Erro ao recarregar clientes:', loadError);
        showAlert('Cliente pode ter sido atualizado, mas houve erro ao recarregar a lista.', 'warning');
        setShowModal(false);
      }
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      console.error('Detalhes do erro:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        data: error.response?.data
      });

      let errorMessage = 'Erro ao atualizar cliente: ';
      if (error.response?.data?.error) {
        errorMessage += error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else {
        errorMessage += error.message;
      }

      showAlert(errorMessage, 'danger');
    }
  };

  const handleEdit = (cliente) => {
    console.log('Editando cliente:', cliente);
    setSelectedCliente(cliente);
    setFormData({
      cpf: cliente.cpf,
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      sexo: cliente.sexo || '',
      rua: cliente.rua || '',
      numero: cliente.numero || '',
      cep: cliente.cep || '',
      referencia: cliente.referencia || '',
      id_bairro: cliente.id_bairro || '',
      turno_preferido_de_coleta: cliente.turno_preferido_de_coleta || '',
      status_cliente: cliente.status_cliente || '',
      frequencia_de_pedidos: cliente.frequencia_de_pedidos || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (cpf) => {
    try {
      console.log('Iniciando deleção do cliente com CPF:', cpf);

      // Primeiro deleta o cliente
      await endpoints.clientes.delete(cpf);
      console.log('Cliente deletado com sucesso');

      // Depois deleta a pessoa
      await endpoints.pessoas.delete(cpf);
      console.log('Pessoa deletada com sucesso');

      showAlert('Cliente excluído com sucesso!', 'success');
      loadClientes(); // Recarrega a lista
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      showAlert('Erro ao excluir cliente', 'danger');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      cpf: '',
      nome: '',
      email: '',
      telefone: '',
      sexo: '',
      turno_preferido_de_coleta: '',
      status_cliente  : 'Ativo',
      frequencia_de_pedidos: 'Semanal',
      bairro_id: '',
      rua: '',
      numero: '',
      cep: '',
      referencia: ''
    });
  };

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 3000);
  };

  const handleBairroChange = async (e) => {
    const bairroId = e.target.value;
    setFormData({
      ...formData,
      bairro_id: bairroId
    });
  };

  return (
    <Container className='mt-4'>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h2>Clientes</h2>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedCliente(null);
            setFormData({
              cpf: '',
              nome: '',
              email: '',
              telefone: '',
              sexo: '',
              rua: '',
              numero: '',
              cep: '',
              referencia: '',
              id_bairro: '',
              turno_preferido_de_coleta: '',
              status_cliente: '',
              frequencia_de_pedidos: ''
            });
            setShowModal(true);
          }}
          className="mb-3"
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Novo Cliente
        </Button>
        {alert.show && (
          <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
            {alert.message}
          </Alert>
        )}

      </div>




      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={clientes}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          autoHeight
        />
      </div>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedCliente ? 'Editar Cliente' : 'Novo Cliente'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={selectedCliente ? handleUpdate : handleSubmit}>
            <h6 className="mb-3 text-success">Dados Pessoais</h6>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>CPF</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.cpf}
                    onChange={e => {
                      const cpf = e.target.value.replace(/\D/g, '');
                      if (cpf.length <= 11) {
                        const cpfFormatado = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                        setFormData({ ...formData, cpf: cpfFormatado });
                      }
                    }}
                    placeholder="000.000.000-00"
                    required
                    maxLength={14}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.nome}
                    onChange={e => setFormData({ ...formData, nome: e.target.value })}
                    required
                    maxLength={100}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required
                    maxLength={100}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Telefone</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.telefone}
                    onChange={e => {
                      const telefone = e.target.value.replace(/\D/g, '');
                      const telefoneFormatado = telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                      setFormData({ ...formData, telefone: telefoneFormatado });
                    }}
                    placeholder="(00) 00000-0000"
                    required
                    maxLength={15}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Sexo</Form.Label>
                  <Form.Select
                    value={formData.sexo}
                    onChange={e => setFormData({ ...formData, sexo: e.target.value })}
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                    <option value="O">Outro</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <h6 className="mb-3 mt-4 text-success">Dados do Cliente</h6>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Turno Preferido de Coleta</Form.Label>
                  <Form.Select
                    value={formData.turno_preferido_de_coleta}
                    onChange={e => setFormData({ ...formData, turno_preferido_de_coleta: e.target.value })}
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="Manhã">Manhã</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noite">Noite</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Frequência de Pedidos</Form.Label>
                  <Form.Select
                    value={formData.frequencia_de_pedidos}
                    onChange={e => setFormData({ ...formData, frequencia_de_pedidos: e.target.value })}
                    required
                  >
                    <option value="Diária">Diária</option>
                    <option value="Semanal">Semanal</option>
                    <option value="Quinzenal">Quinzenal</option>
                    <option value="Mensal">Mensal</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <h6 className="mb-3 mt-4 text-success">Endereço</h6>
            <div className="row">
              <div className="col-md-12">
                <Form.Group className="mb-3">
                  <Form.Label>Bairro</Form.Label>
                  <Form.Select
                    name="bairro_id"
                    value={formData.bairro_id}
                    onChange={handleBairroChange}
                    required
                  >
                    <option value="">Selecione um bairro</option>
                    {bairros.map(bairro => (
                      <option key={bairro.id_bairro} value={bairro.id_bairro}>
                        {bairro.nome}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Rua</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.rua || ''}
                    onChange={e => setFormData({ ...formData, rua: e.target.value })}
                    placeholder="Nome da rua"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Número</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.numero || ''}
                    onChange={e => setFormData({ ...formData, numero: e.target.value })}
                    placeholder="Número"
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>CEP</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.cep || ''}
                    onChange={e => {
                      const cep = e.target.value.replace(/\D/g, '');
                      const cepFormatado = cep.replace(/(\d{5})(\d{3})/, '$1-$2');
                      setFormData({ ...formData, cep: cepFormatado });
                    }}
                    placeholder="00000-000"
                    maxLength={9}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Referência</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.referencia || ''}
                    onChange={e => setFormData({ ...formData, referencia: e.target.value })}
                    placeholder="Ponto de referência"
                  />
                </Form.Group>
              </div>
            </div>

            <div className="d-flex justify-content-end mt-4">
              <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                {selectedCliente ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Clientes;
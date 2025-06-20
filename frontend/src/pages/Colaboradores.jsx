import React, { useState, useEffect } from 'react';
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
    cpf: '',
    telefone: '',
    email: '',
    dataAdmissao: new Date().toISOString().split('T')[0],
    sexo: '',
    cargo: '',
    nacionalidade: 'Brasileiro'
  });
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  useEffect(() => {
    loadColaboradores();
    loadCargos();
  }, []);

  const loadColaboradores = async () => {
    try {
      console.log('Iniciando carregamento de colaboradores...');
      const response = await endpoints.colaboradores.list();
      console.log('Resposta da API de colaboradores:', response);

      if (!response?.data) {
        console.log('Nenhum dado recebido da API');
        setColaboradores([]);
        return;
      }

      const colaboradores = response.data;
      console.log('Dados dos colaboradores recebidos:', colaboradores);

      const colaboradoresFormatados = colaboradores.map(colaborador => {
        if (!colaborador) return null;

        return {
          id: colaborador.cpf || '',
          nome: colaborador.pessoa?.nome || '',
          cpf: colaborador.cpf || '',
          telefone: colaborador.pessoa?.telefone || '',
          email: colaborador.pessoa?.email || '',
          dataAdmissao: colaborador.dataAdmissao ? new Date(colaborador.dataAdmissao).toLocaleDateString() : '',
          sexo: colaborador.pessoa?.sexo || '',
          cargo: colaborador.cargos?.nomeCargo || '',
          idCargo: colaborador.idCargo || '',
          estado: colaborador.estado || 'ativo' // Map the new attribute
        };
      }).filter(Boolean); // Remove possíveis nulls

      console.log('Colaboradores formatados:', colaboradoresFormatados);
      setColaboradores(colaboradoresFormatados);
    } catch (error) {
      console.error('Erro ao carregar colaboradores:', error);
      showAlert('Erro ao carregar colaboradores', 'danger');
      setColaboradores([]);
    }
  };

  const loadCargos = async () => {
    try {
      console.log('Iniciando carregamento de cargos...');
      const response = await endpoints.cargos.list();
      console.log('Resposta da API de cargos:', response);

      if (response?.data) {
        console.log('Dados dos cargos recebidos:', response.data);
        setCargos(response.data);
      } else {
        console.log('Nenhum cargo recebido da API');
        setCargos([]);
      }
    } catch (error) {
      console.error('Erro ao carregar cargos:', error);
      showAlert('Erro ao carregar cargos', 'danger');
      setCargos([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cpf') {
      // Remove caracteres não numéricos
      const cpfNumerico = value.replace(/\D/g, '');
      // Formata o CPF (XXX.XXX.XXX-XX)
      let cpfFormatado = cpfNumerico;
      if (cpfNumerico.length > 3) {
        cpfFormatado = cpfNumerico.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      }
      setFormData(prev => ({
        ...prev,
        [name]: cpfFormatado
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Iniciando operação com colaborador...');
      console.log('Dados do formulário:', formData);
      console.log('Colaborador selecionado:', selectedColaborador);

      // Validação do CPF
      const cpfNumerico = formData.cpf.replace(/\D/g, '');
      if (!cpfNumerico || cpfNumerico.length !== 11) {
        showAlert('CPF deve conter 11 dígitos', 'danger');
        return;
      }

      // Primeiro, criar/atualizar a pessoa
      const pessoaData = {
        cpf: cpfNumerico,
        nome: formData.nome || '',
        email: formData.email || '',
        telefone: formData.telefone || '',
        sexo: formData.sexo || ''
      };

      try {
        if (selectedColaborador) {
          // Se estiver editando, atualiza a pessoa
          await endpoints.pessoas.update(cpfNumerico, pessoaData);
        } else {
          // Se for novo, cria a pessoa
          await endpoints.pessoas.create(pessoaData);
        }
      } catch (pessoaError) {
        console.error('Erro ao salvar pessoa:', pessoaError);
        showAlert('Erro ao salvar dados da pessoa', 'danger');
        return;
      }

      // Depois, criar/atualizar o colaborador
      const colaboradorData = {
        cpf: cpfNumerico,
        dataAdmissao: formData.dataAdmissao || new Date().toISOString().split('T')[0],
        carga_horaria: 36,
        nacionalidade: formData.nacionalidade || 'Brasileiro',
id_cargo: parseInt(formData.cargo),
        estado: formData.estado || 'ativo' // Include state in data
      };

      if (selectedColaborador) {
        console.log('Atualizando colaborador existente...');
        try {
          await endpoints.colaboradores.update(cpfNumerico, colaboradorData);
          console.log('Colaborador atualizado com sucesso');
          showAlert('Colaborador atualizado com sucesso!', 'success');
        } catch (updateError) {
          console.warn('Aviso: Erro ao atualizar colaborador, mas continuando...', updateError);
          showAlert('Colaborador pode ter sido atualizado, mas houve erro na resposta.', 'warning');
        }
      } else {
        console.log('Criando novo colaborador...');
        try {
          await endpoints.colaboradores.create(colaboradorData);
          console.log('Colaborador criado com sucesso');
          showAlert('Colaborador cadastrado com sucesso!', 'success');
        } catch (createError) {
          console.warn('Aviso: Erro ao criar colaborador, mas continuando...', createError);
          showAlert('Colaborador pode ter sido cadastrado, mas houve erro na resposta.', 'warning');
        }
      }

      // Tenta recarregar os dados mesmo com erro
      try {
        await loadColaboradores();
        handleCloseModal();
      } catch (loadError) {
        console.error('Erro ao recarregar colaboradores:', loadError);
        handleCloseModal();
      }
    } catch (error) {
      console.error('Erro geral na operação:', error);
      showAlert('Erro ao processar operação', 'danger');
    }
  };

  const handleEdit = (colaborador) => {
    // Busca o colaborador pelo CPF/id na lista original para garantir dados completos
    const colaboradorCompleto = colaboradores.find(c => c.cpf === colaborador.cpf || c.id === colaborador.id) || colaborador;

    setSelectedColaborador(colaboradorCompleto);
    setFormData({
      nome: colaboradorCompleto.nome || colaboradorCompleto.pessoa?.nome || '',
      cpf: colaboradorCompleto.cpf || colaboradorCompleto.pessoa?.cpf || '',
      telefone: colaboradorCompleto.telefone || colaboradorCompleto.pessoa?.telefone || '',
      email: colaboradorCompleto.email || colaboradorCompleto.pessoa?.email || '',
      dataAdmissao: colaboradorCompleto.dataAdmissao
        ? (colaboradorCompleto.dataAdmissao.length === 10
          ? colaboradorCompleto.dataAdmissao.split('/').reverse().join('-')
          : colaboradorCompleto.dataAdmissao)
        : new Date().toISOString().split('T')[0],
      sexo: colaboradorCompleto.sexo || colaboradorCompleto.pessoa?.sexo || '',
      cargo: colaboradorCompleto.idCargo || colaboradorCompleto.cargo || '',
      nacionalidade: colaboradorCompleto.nacionalidade || 'Brasileiro'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este colaborador?')) {
      try {
        const cpfNumerico = id.replace(/\D/g, '');
        await endpoints.colaboradores.delete(cpfNumerico);
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
      cpf: '',
      telefone: '',
      email: '',
      dataAdmissao: new Date().toISOString().split('T')[0],
      sexo: '',
      cargo: '',
      nacionalidade: 'Brasileiro',
      estado: 'ativo' // Reset state when closing modal
    });
  };

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 3000);
  };

  const getStatusBadge = (status) => {
    const variants = {
      ATIVO: 'primary',
      INATIVO: 'danger',
      FERIAS: 'warning',
      AFASTADO: 'info'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const columns = [
    {
      field: 'nome',
      headerName: 'Nome',
      width: 200,
    },
    {
      field: 'cpf',
      headerName: 'CPF',
      width: 130,
    },
    {
      field: 'telefone',
      headerName: 'Telefone',
      width: 150
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
    },
    {
      field: 'dataAdmissao',
      headerName: 'Data de Admissão',
      width: 150,

    },
    {
      field: 'sexo',
      headerName: 'Sexo',
      width: 60,
    },
    {
      field: 'cargo',
      headerName: 'Cargo',
      width: 180
    },
    {
      field: 'estado',
      headerName: 'Estado',
      width: 100,
      renderCell: (params) => getStatusBadge(params.value) // Use the existing badge function
    },
    {
      field: 'acoes',
      headerName: 'Ações',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <div>
          <Button
            variant="outline-primary"
            size="sm"
            className="me-2"
            onClick={() => handleEdit(params.row)}
          >
            Editar
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="container mt-4">
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

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={colaboradores}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          autoHeight
          getRowId={(row) => row.id || row.cpf}
          isRowSelectable={() => false}
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
            <div className="row">
              <div className="col-md-12">
                <Form.Group className="mb-3">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </div>
            </div>

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
                    disabled={!!selectedColaborador}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Telefone</Form.Label>
                  <Form.Control
                    type="text"
                    name="telefone"
                    value={formData.telefone}
                    onChange={e => {
                      const telefone = e.target.value.replace(/\D/g, '');
                      let telefoneFormatado = telefone;
                      if (telefone.length > 10) {
                        telefoneFormatado = telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                      } else if (telefone.length > 2) {
                        telefoneFormatado = telefone.replace(/(\d{2})(\d{4,5})?(\d{0,4})?/, (m, d1, d2, d3) => {
                          let out = `(${d1}`;
                          if (d2) out += `) ${d2}`;
                          if (d3) out += `-${d3}`;
                          return out;
                        });
                      }
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
              <div className="col-md-12">
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder='email@exemplo.com'
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Data de Admissão</Form.Label>
                  <Form.Control
                    type="date"
                    name="dataAdmissao"
                    value={formData.dataAdmissao}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Nacionalidade</Form.Label>
                  <Form.Control
                    type="text"
                    name="nacionalidade"
                    value={formData.nacionalidade}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Sexo</Form.Label>
                  <Form.Select
                    name="sexo"
                    value={formData.sexo}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                    <option value="O">Outro</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    required

                  >
                    <option value="ativo">Ativo</option>
                    <option value="desativado">Desativado</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Cargo</Form.Label>
                  <Form.Select
                    name="cargo"
                    value={formData.cargo}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione um cargo</option>
                    {cargos && cargos.length > 0 ? (
                      cargos.map(cargo => (
                        <option key={cargo.idCargo} value={cargo.idCargo}>
                          {cargo.nomeCargo}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>Nenhum cargo disponível</option>
                    )}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={handleCloseModal} className="me-2">
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
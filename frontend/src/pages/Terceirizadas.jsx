import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import endpoints from '../services/endpoints';
import { DataGrid } from '@mui/x-data-grid';

function Terceirizadas() {
  const [terceirizadas, setTerceirizadas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTerceirizada, setSelectedTerceirizada] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
    tipo_servico: '',
    status: 'ativo',
    horarioDeFuncionamento: '', // Valor padrão em horas
    hierarquia: '' // Novo campo hierarquia
  });
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const [loading, setLoading] = useState(true); // Adicionado estado loading

  useEffect(() => {
    loadTerceirizadas();
  }, []);

  const loadTerceirizadas = async () => {
    setLoading(true); // Inicia loading
    try {
      console.log('Iniciando carregamento de terceirizadas...');
      const response = await endpoints.terceirizadas.list();
      console.log('Resposta da API de terceirizadas:', response);

      if (!response?.data) {
        console.log('Nenhum dado recebido da API');
        setTerceirizadas([]);
        return;
      }

      const terceirizadas = response.data;
      console.log('Dados das terceirizadas recebidos:', terceirizadas);

      const terceirizadasFormatadas = terceirizadas.map(terceirizada => {
        if (!terceirizada) return null;

        return {
          id: terceirizada.cnpj, // Usando o CNPJ como ID
          cnpj: terceirizada.cnpj || '',
          nome: terceirizada.nome || '',
          telefone: terceirizada.telefone || '',
          email: terceirizada.email || '',
          horarioDeFuncionamento: terceirizada.horarioDeFuncionamento || '',
          createdAt: terceirizada.createdAt || '',
          updatedAt: terceirizada.updatedAt || '',
          estado: terceirizada.estado || 'INATIVO' // Include estado attribute, default to INATIVO
        };
      }).filter(Boolean); // Remove possíveis nulls

      console.log('Terceirizadas formatadas:', terceirizadasFormatadas);
      setTerceirizadas(terceirizadasFormatadas);
    } catch (error) {
      console.error('Erro ao carregar terceirizadas:', error);
      showAlert('Erro ao carregar terceirizadas', 'danger');
      setTerceirizadas([]);
    }
    setLoading(false); // Finaliza loading
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cnpjNumerico = formData.cnpj.replace(/\D/g, '');
      if (!cnpjNumerico || cnpjNumerico.length !== 14) {
        showAlert('CNPJ deve conter 14 dígitos', 'danger');
        return;
      }

      // Envia o horário de funcionamento como string completa (ex: "08:00-18:00")
      const terceirizadaData = {
        nome: formData.nome,
        cnpj: cnpjNumerico,
        telefone: formData.telefone,
        email: formData.email,
        horarioDeFuncionamento: formData.horarioDeFuncionamento,
        hierarquia: formData.hierarquia, // Incluindo hierarquia nos dados da terceirizada
        estado: formData.status // Enviando o estado para a API
      };

      if (selectedTerceirizada) {
        // Garante que o CNPJ enviado na URL está sem formatação
        const cnpjNumericoEdit = (selectedTerceirizada.cnpj || '').replace(/\D/g, '');
        await endpoints.terceirizadas.update(cnpjNumericoEdit, terceirizadaData);
        showAlert('Terceirizada atualizada com sucesso!', 'success');
      } else {
        await endpoints.terceirizadas.create(terceirizadaData);
        showAlert('Terceirizada cadastrada com sucesso!', 'success');
      }

      await loadTerceirizadas();
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar terceirizada:', error);
      showAlert('Erro ao salvar terceirizada', 'danger');
    }
  };

  const handleEdit = (terceirizada) => {
    setSelectedTerceirizada(terceirizada);
    setFormData({
      nome: terceirizada.nome || '',
      cnpj: terceirizada.cnpj || '',
      telefone: terceirizada.telefone || '',
      email: terceirizada.email || '',
      horarioDeFuncionamento: terceirizada.horarioDeFuncionamento || '',
      hierarquia: terceirizada.hierarquia || '', // Adicionando hierarquia ao editar
      status: terceirizada.estado || 'INATIVO' // Adicionando estado ao editar
    });
    setShowModal(true);
  };

  const handleDelete = async (terceirizada) => {
    if (window.confirm('Tem certeza que deseja excluir esta terceirizada?')) {
      try {
        console.log('Excluindo terceirizada:', terceirizada);
        await endpoints.terceirizadas.delete(terceirizada.cnpj);
        showAlert('Terceirizada excluída com sucesso!', 'success');
        await loadTerceirizadas();
      } catch (error) {
        console.error('Erro ao excluir terceirizada:', error);
        showAlert('Erro ao excluir terceirizada', 'danger');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTerceirizada(null);
    setFormData({
      nome: '',
      cnpj: '',
      email: '',
      telefone: '',
      endereco: '',
      tipo_servico: '',
      status: 'ativo',
      horarioDeFuncionamento: '',
      hierarquia: '' // Resetando hierarquia ao fechar o modal
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
      PENDENTE: 'warning' // Keeping pendente as warning for now
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const formatCNPJ = (cnpj) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  };

  const columns = [
    {
      field: 'nome',
      headerName: 'Nome',
      width: 200,
    },
    {
      field: 'cnpj',
      headerName: 'CNPJ',
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
      field: 'horarioDeFuncionamento',
      headerName: 'Horário de Funcionamento',
      width: 200,
    },
    {
      field: 'estado',
      headerName: 'Estado',
      width: 100,
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
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h2 className="">Terceirizadas</h2>
        <div className="col-12 col-md-auto px-0 mt-2 mt-md-0">
          <Button variant="primary" onClick={() => setShowModal(true)} className="mb-3 w-100">
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Nova Terceirizada
          </Button>
        </div>
      </div>
      {alert.show && (
        <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
          {alert.message}
        </Alert>
      )}
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={terceirizadas}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          getRowId={(row) => row.id || row.cnpj}
          checkboxSelection={false}
          isRowSelectable={() => false}
          autoHeight
          loading={loading}
        />
      </div>
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedTerceirizada ? 'Editar Terceirizada' : 'Nova Terceirizada'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-8">
                <Form.Group className="mb-3" style={{ minWidth: 220 }}>
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3 w-100">
                  <Form.Label>CNPJ</Form.Label>
                  <Form.Control
                    type="text"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={e => {
                      const cnpj = e.target.value.replace(/\D/g, '');
                      let cnpjFormatado = cnpj;
                      if (cnpj.length > 14) return;
                      if (cnpj.length > 12)
                        cnpjFormatado = cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
                      else if (cnpj.length > 8)
                        cnpjFormatado = cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,4})/, '$1.$2.$3/$4');
                      else if (cnpj.length > 5)
                        cnpjFormatado = cnpj.replace(/^(\d{2})(\d{3})(\d{0,3})/, '$1.$2.$3');
                      else if (cnpj.length > 2)
                        cnpjFormatado = cnpj.replace(/^(\d{2})(\d{0,3})/, '$1.$2');
                      setFormData({ ...formData, cnpj: cnpjFormatado });
                    }}
                    placeholder="00.000.000/0000-00"
                    maxLength={18}
                    required
                    disabled={!!selectedTerceirizada}
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
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder='email@exemplo.com'
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3" style={{ minWidth: 220 }}>
                  <Form.Label>Telefone</Form.Label>
                  <Form.Control
                    type="tel"
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
                    required
                    placeholder='(00) 00000-0000'
                    maxLength={15}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Horário de Funcionamento</Form.Label>
                  <Form.Control
                    type="text"
                    name="horarioDeFuncionamento"
                    value={formData.horarioDeFuncionamento}
                    onChange={(e) => setFormData({ ...formData, horarioDeFuncionamento: e.target.value })}
                    placeholder="Ex: 08:00-18:00"
                    required
                  />
                  <Form.Text className="text-muted">
                    Formato: HH:MM-HH:MM (ex: 08:00-18:00) - Apenas a hora inicial será salva
                  </Form.Text>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    required
                  >
                    <option value="ativo">Ativo</option>
                    <option value="desativado">Desativado</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                {selectedTerceirizada ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </div>

          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Terceirizadas;

import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import endpoints from '../services/endpoints';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const Cargos = () => {
  const [cargos, setCargos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCargo, setSelectedCargo] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    salario: 0,
    hierarquia: 1
  });
  const [alert, setAlert] = useState({ show: false, message: '', variant: '', modal: false });
  const [loading, setLoading] = useState(true); // Adicionado estado loading

  const showAlert = (message, variant, modal = false) => {
    setAlert({ show: true, message, variant, modal });
    setTimeout(() => setAlert({ show: false, message: '', variant: '', modal: false }), 3000);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCargo(null);
    setFormData({
      nome: '',
      descricao: '',
      salario: 0,
      hierarquia: 1
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const loadCargos = async () => {
    setLoading(true);
    try {
      console.log('Iniciando carregamento de cargos...');
      const response = await endpoints.cargos.list();
      console.log('Resposta da API de cargos:', response);

      if (response?.data && response.data.length > 0) {
        const cargosFormatados = response.data.map(cargo => ({
          id: cargo.idCargo,
          nome: cargo.nomeCargo,
          descricao: cargo.descricao,
          salario: cargo.salario,
          hierarquia: cargo.hierarquia
        }));
        setCargos(cargosFormatados);
      } else if (response?.data && response.data.length === 0) {
        showAlert('Nenhum cargo encontrado.', 'warning');
      } else {
        showAlert('Erro ao buscar cargos. Tente novamente.', 'danger');
      }
    } catch (error) {
      console.error('Erro ao carregar cargos:', error);
      showAlert('Erro ao carregar cargos', 'danger');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCargos();
  }, []);

  const columns = [
    {
      field: 'nome',
      headerName: 'Nome',
      width: 200,
    },
    {
      field: 'descricao',
      headerName: 'Descrição',
      width: 300,
    },
    {
      field: 'hierarquia',
      headerName: 'Hierarquia',
      width: 90,

    },
    {
      field: 'salario',
      headerName: 'Salário (R$)',
      width: 100,
    },
    {
      field: 'acoes',
      headerName: '',
      width: 70,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => handleEdit(params.row)}
        >
          Editar
        </Button>
      ),
    },
  ];

  const handleEdit = (cargo) => {
    console.log('Editando cargo:', cargo);
    setSelectedCargo(cargo);
    setFormData({
      nome: cargo.nome || '',
      descricao: cargo.descricao || '',
      salario: cargo.salario || 0,
      hierarquia: cargo.hierarquia || 1
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hadError = false;
    try {
      console.log('Iniciando operação com cargo...');
      console.log('Dados do formulário:', formData);
      console.log('Cargo selecionado:', selectedCargo);

      const cargoData = {
        nomeCargo: formData.nome || '',
        descricao: formData.descricao || '',
        salario: formData.salario || 0,
        hierarquia: formData.hierarquia || 1
      };
      console.log('Dados do cargo para operação:', cargoData);

      if (selectedCargo) {
        console.log('Atualizando cargo existente...');
        try {
          await endpoints.cargos.update(selectedCargo.id, cargoData);
          showAlert('Cargo atualizado com sucesso!', 'success');
        } catch (updateError) {
          let backendMsg = updateError?.response?.data?.error || updateError?.response?.data?.message || updateError.message || 'Erro ao atualizar cargo';
          showAlert(backendMsg, 'danger', true);
          hadError = true;
        }
      } else {
        console.log('Criando novo cargo...');
        try {
          await endpoints.cargos.create(cargoData);
          showAlert('Cargo cadastrado com sucesso!', 'success');
        } catch (createError) {
          let backendMsg = createError?.response?.data?.error || createError?.response?.data?.message || createError.message || 'Erro ao cadastrar cargo';
          showAlert(backendMsg, 'danger', true);
          hadError = true;
        }
      }

      // Tenta recarregar os dados mesmo com erro
      try {
        await loadCargos();
        if (!hadError) {
          handleCloseModal();
        }
      } catch (loadError) {
        if (!hadError) {
          handleCloseModal();
        }
      }
    } catch (error) {
      let backendMsg = error?.response?.data?.error || error?.response?.data?.message || error.message || 'Erro ao processar operação';
      showAlert(backendMsg, 'danger', true);
      // Não fecha o modal em caso de erro!
    }
  };

  return (
    <div className="container mt-4">
      <div className='d-flex justify-content-between align-items-center mb-4 flex-wrap'>
        <h2 className=''>Cargos</h2>
        <div className="col-12 col-md-auto px-0 mt-2 mt-md-0">
          <Button
            variant="primary"
            className=" w-100"
            onClick={() => {
              setSelectedCargo(null);
              setFormData({
                nome: '',
                descricao: '',
                salario: 0,
                hierarquia: ''
              });
              setShowModal(true);
            }}
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Novo Cargo
          </Button>
        </div>
      </div>

      <div style={{ width: '100%' }}>
        <DataGrid
          rows={cargos}
          columns={columns}
          getRowId={(row) => row.id}
          initialState={{
            pagination: { paginationModel: { pageSize: 5, page: 0 } }
          }}
          pageSizeOptions={[5]}
          pagination
          disableSelectionOnClick
          autoHeight={true}
          isRowSelectable={() => false}
          loading={loading}
        />
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedCargo ? 'Editar Cargo' : 'Novo Cargo'}
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
              <div className="col-md-12">
                <Form.Group className="mb-3">
                  <Form.Label>Descrição</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    required
                    placeholder='Descreva as responsabilidades e requisitos do cargo'
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Salário (R$)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="salario"
                    value={formData.salario}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Nível de Hierarquia</Form.Label>
                  <Form.Select
                    name="hierarquia"
                    value={formData.hierarquia}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="1">Alto</option>
                    <option value="2">Médio</option>
                    <option value="3">Baixo</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                {selectedCargo ? 'Atualizar' : 'Cadastrar'}
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
    </div>
  );
};

export default Cargos;
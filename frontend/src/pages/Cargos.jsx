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
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const [loading, setLoading] = useState(true); // Adicionado estado loading

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 3000);
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
    setLoading(true); // Inicia loading
    try {
      console.log('Iniciando carregamento de cargos...');
      const response = await endpoints.cargos.list();
      console.log('Resposta da API de cargos:', response);

      if (response?.data) {
        console.log('Dados dos cargos recebidos:', response.data);
        const cargosFormatados = response.data.map(cargo => ({
          id: cargo.idCargo,
          nome: cargo.nomeCargo,
          descricao: cargo.descricao,
          salario: cargo.salario,
          hierarquia: cargo.hierarquia
        }));
        console.log('Cargos formatados:', cargosFormatados);
        setCargos(cargosFormatados);
      } else {
        console.log('Nenhum cargo recebido da API');
        setCargos([]);
      }
    } catch (error) {
      console.error('Erro ao carregar cargos:', error);
      showAlert('Erro ao carregar cargos', 'danger');
      setCargos([]);
    }
    setLoading(false); // Finaliza loading
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
      width: 100,

    },
    {
      field: 'salario',
      headerName: 'Salário (R$)',
      width: 150,
    },
    {
      field: 'acoes',
      headerName: 'Ações',
      width: 150,
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
          console.log('Cargo atualizado com sucesso');
          showAlert('Cargo atualizado com sucesso!', 'success');
        } catch (updateError) {
          console.warn('Aviso: Erro ao atualizar cargo, mas continuando...', updateError);
          showAlert('Cargo pode ter sido atualizado, mas houve erro na resposta.', 'warning');
        }
      } else {
        console.log('Criando novo cargo...');
        try {
          await endpoints.cargos.create(cargoData);
          console.log('Cargo criado com sucesso');
          showAlert('Cargo cadastrado com sucesso!', 'success');
        } catch (createError) {
          console.warn('Aviso: Erro ao criar cargo, mas continuando...', createError);
          showAlert('Cargo pode ter sido cadastrado, mas houve erro na resposta.', 'warning');
        }
      }

      // Tenta recarregar os dados mesmo com erro
      try {
        await loadCargos();
        handleCloseModal();
      } catch (loadError) {
        console.error('Erro ao recarregar cargos:', loadError);
        handleCloseModal();
      }
    } catch (error) {
      console.error('Erro geral na operação:', error);
      showAlert('Erro ao processar operação', 'danger');
    }
  };

  return (
    <div className="container mt-4">
      <div className='d-flex justify-content-between align-items-center mb-4 flex-wrap'>
        <h2 className=''>Cargos</h2>
        <div className="col-12 col-md-auto px-0 mt-2 mt-md-0">
          <Button
            variant="primary"
            className="mb-3 w-100"
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


      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={cargos}
          columns={columns}
          getRowId={(row) => row.id}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          autoHeight
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

      {alert.show && (
        <Alert
          variant={alert.variant}
          onClose={() => setAlert({ show: false, message: '', variant: '' })}
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
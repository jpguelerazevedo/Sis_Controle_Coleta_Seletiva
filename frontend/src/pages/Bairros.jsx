import { useEffect, useState } from 'react';
import { Table, Alert, Button, Modal, Form } from 'react-bootstrap';
import endpoints from '../services/endpoints';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { DataGrid } from '@mui/x-data-grid';

function Bairros() {
    const [bairros, setBairros] = useState([]);
    const [alert, setAlert] = useState({ show: false, message: '', variant: '', modal: false });
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        distancia_sede: '',
        estado_de_acesso: ''
    });
    const [selectedBairro, setSelectedBairro] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBairros();
    }, []);

    const loadBairros = async () => {
        setLoading(true);
        try {
            const response = await endpoints.bairros.list();
            setBairros(response.data);
        } catch (error) {
            setAlert({ show: true, message: 'Erro ao carregar bairros', variant: 'danger' });
        }
        setLoading(false);
    };

    const handleShowModal = () => setShowModal(true);

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedBairro(null);
        setFormData({
            nome: '',
            distancia_sede: '',
            estado_de_acesso: ''
        });
    };

    const showAlert = (message, variant, modal = false) => {
        setAlert({ show: true, message, variant, modal });
        setTimeout(() => setAlert({ show: false, message: '', variant: '', modal: false }), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let hadError = false;
        try {
            if (selectedBairro) {
                try {
                    await endpoints.bairros.update(selectedBairro.id_bairro, formData);
                    showAlert('Bairro atualizado com sucesso!', 'success');
                } catch (updateError) {
                    let backendMsg = updateError?.response?.data?.error || updateError?.response?.data?.message || updateError.message || 'Erro ao atualizar bairro';
                    showAlert(backendMsg, 'danger', true);
                    hadError = true;
                }
            } else {
                try {
                    await endpoints.bairros.create(formData);
                    showAlert('Bairro cadastrado com sucesso!', 'success');
                } catch (createError) {
                    let backendMsg = createError?.response?.data?.error || createError?.response?.data?.message || createError.message || 'Erro ao cadastrar bairro';
                    showAlert(backendMsg, 'danger', true);
                    hadError = true;
                }
            }
            if (!hadError) {
                handleCloseModal();
            }
            loadBairros();
        } catch (error) {
            let backendMsg = error?.response?.data?.error || error?.response?.data?.message || error.message || 'Erro ao salvar bairro';
            showAlert(backendMsg, 'danger', true);
            // Não fecha o modal em caso de erro!
        }
    };

    const handleEdit = (bairro) => {
        setSelectedBairro(bairro);
        setFormData({
            nome: bairro.nome || '',
            distancia_sede: bairro.distancia_sede || '',
            estado_de_acesso: bairro.estado_de_acesso || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id_bairro) => {
        if (window.confirm('Tem certeza que deseja excluir este bairro?')) {
            try {
                await endpoints.bairros.delete(id_bairro);
                setAlert({ show: true, message: 'Bairro excluído com sucesso!', variant: 'success' });
                loadBairros();
            } catch (error) {
                setAlert({ show: true, message: 'Erro ao excluir bairro', variant: 'danger' });
            }
        }
    };

    const columns = [
        { field: 'nome', headerName: 'Nome', width: 200 },
        { field: 'distancia_sede', headerName: 'Distância Sede', width: 120 },
        { field: 'estado_de_acesso', headerName: 'Estado de Acesso', width: 140 },
        {
            field: 'acoes',
            headerName: '',
            width: 70,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
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
        <div className='container mt-4'>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                <h2>Bairros</h2>
                <div className="col-12 col-md-auto px-0 mt-2 mt-md-0">
                    <Button variant="primary" onClick={handleShowModal} className=" w-100">
                        <FontAwesomeIcon icon={faPlus} className="me-2" />
                        Novo Bairro
                    </Button>
                </div>
            </div>
            <div style={{ width: '100%', marginBottom: 24 }}>
                <DataGrid
                    rows={bairros}
                    columns={columns}
                    getRowId={row => row.id_bairro}
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

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedBairro ? 'Editar Bairro' : 'Novo Bairro'}</Modal.Title>
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
                        <Form.Group className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.nome}
                                onChange={e => setFormData({ ...formData, nome: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Distância Sede</Form.Label>
                            <Form.Control
                                type="number"
                                value={formData.distancia_sede}
                                onChange={e => setFormData({ ...formData, distancia_sede: e.target.value })}
                                required
                                placeholder="Distancia (Km)"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Estado de Acesso</Form.Label>
                            <Form.Select
                                value={formData.estado_de_acesso}
                                onChange={e => setFormData({ ...formData, estado_de_acesso: e.target.value })}
                                required
                            >
                                <option value="">Selecione...</option>
                                <option value="Facil">Facil</option>
                                <option value="Mediano">Mediano</option>
                                <option value="Difícil">Difícil</option>
                            </Form.Select>
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Cancelar
                            </Button>
                            <Button variant="primary" type="submit">
                                {selectedBairro ? 'Atualizar' : 'Cadastrar'}
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
}

export default Bairros;

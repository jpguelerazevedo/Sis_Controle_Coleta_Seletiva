import { useEffect, useState } from 'react';
import { Table, Alert, Button, Modal, Form } from 'react-bootstrap';
import endpoints from '../services/endpoints';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { DataGrid } from '@mui/x-data-grid';

function Bairros() {
    const [bairros, setBairros] = useState([]);
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedBairro) {
                await endpoints.bairros.update(selectedBairro.id_bairro, formData);
                setAlert({ show: true, message: 'Bairro atualizado com sucesso!', variant: 'success' });
            } else {
                await endpoints.bairros.create(formData);
                setAlert({ show: true, message: 'Bairro cadastrado com sucesso!', variant: 'success' });
            }
            handleCloseModal();
            loadBairros();
        } catch (error) {
            setAlert({ show: true, message: 'Erro ao salvar bairro', variant: 'danger' });
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
        { field: 'nome', headerName: 'Nome', width: 250 },
        { field: 'distancia_sede', headerName: 'Distância Sede', width: 120 },
        { field: 'estado_de_acesso', headerName: 'Estado de Acesso', width: 140 },
        {
            field: 'acoes',
            headerName: 'Ações',
            width: 120,
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
        <div className='container mt-4'>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                <h2>Bairros</h2>
                <div className="col-12 col-md-auto px-0 mt-2 mt-md-0">
                    <Button variant="primary" onClick={handleShowModal} className="mb-3 w-100">
                        <FontAwesomeIcon icon={faPlus} className="me-2" />
                        Novo Bairro
                    </Button>
                </div>
            </div>
            {alert.show && (
                <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
                    {alert.message}
                </Alert>
            )}
            <div style={{ height: 500, width: '100%', marginBottom: 24 }}>
                <DataGrid
                    rows={bairros}
                    columns={columns}
                    getRowId={row => row.id_bairro}
                    pageSize={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    disableSelectionOnClick
                    filterMode="client"
                    isRowSelectable={() => false}
                    autoHeight
                    loading={loading}
                />
            </div>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedBairro ? 'Editar Bairro' : 'Novo Bairro'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
        </div>
    );
}

export default Bairros;

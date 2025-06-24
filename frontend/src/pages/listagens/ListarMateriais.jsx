import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import endpoints from '../../services/endpoints';

function ListarMateriais() {
  const [materiais, setMateriais] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMateriais();
  }, []);

  const loadMateriais = async () => {
    setLoading(true);
    try {
      const response = await endpoints.materiais.list();
      if (response?.data) {
        const materiaisFormatados = response.data.map(material => ({
          id: material.idMaterial,
          nome: material.nome,
          peso: material.peso,
          volume: material.volume
        }));
        setMateriais(materiaisFormatados);
      } else {
        setMateriais([]);
      }
    } catch (error) {
      setMateriais([]);
    }
    setLoading(false);
  };

  const columns = [
    { field: 'nome', headerName: 'Nome', width: 200 },
    { field: 'peso', headerName: 'Peso (kg)', width: 120 },
    { field: 'volume', headerName: 'Volume (m³)', width: 120 }
  ];

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-3">Materiais</h2>
      </div>
      <div className="mb-3" />

      <div style={{ width: '100%', marginBottom: 24 }}>
        <DataGrid
          rows={materiais}
          columns={columns}
          getRowId={row => row.id}
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
    </Container>
  );
}

export default ListarMateriais;

import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import endpoints from '../../services/endpoints';

function ListarMateriaisEnviados() {
  const [envios, setEnvios] = useState([]);
  const [materiais, setMateriais] = useState([]);
  const [terceirizadas, setTerceirizadas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnvios();
    loadMateriais();
    loadTerceirizadas();
  }, []);

  const loadEnvios = async () => {
    setLoading(true);
    try {
      const response = await endpoints.envios.list();
      if (response && response.data) {
        const enviosFormatados = response.data.map((e, idx) => {
          let rawData = e.data || e.dataEnvio || e.data_envio || e.createdAt || e.updatedAt || '';
          let dataFormatada = '';
          if (rawData) {
            const dateObj = new Date(rawData);
            if (!isNaN(dateObj)) {
              const dia = String(dateObj.getDate()).padStart(2, '0');
              const mes = String(dateObj.getMonth() + 1).padStart(2, '0');
              const ano = dateObj.getFullYear();
              dataFormatada = `${dia}/${mes}/${ano}`;
            } else {
              dataFormatada = rawData;
            }
          }
          return {
            id: e.idEnvio || e.id_envio || e.id || `row-${idx}`,
            idMaterial: e.idMaterial,
            cnpj: e.cnpj,
            pesoEnviado: e.pesoEnviado || e.peso_enviado,
            volumeEnviado: e.volumeEnviado || e.volume_enviado,
            data: dataFormatada
          };
        });
        setEnvios(enviosFormatados);
      } else {
        setEnvios([]);
      }
    } catch (error) {
      setEnvios([]);
    }
    setLoading(false);
  };

  const loadMateriais = async () => {
    try {
      const response = await endpoints.materiais.list();
      setMateriais(response.data || []);
    } catch (error) {
      setMateriais([]);
    }
  };

  const loadTerceirizadas = async () => {
    try {
      const response = await endpoints.terceirizadas.list();
      setTerceirizadas(response.data || []);
    } catch (error) {
      setTerceirizadas([]);
    }
  };

  const columns = [
    {
      field: 'cnpj',
      headerName: 'Terceirizada',
      width: 200,
      renderCell: (params) => {
        const terceirizada = terceirizadas.find(t => String(t.cnpj) === String(params.row.cnpj));
        return terceirizada ? terceirizada.nome : params.row.cnpj;
      }
    },
    {
      field: 'idMaterial',
      headerName: 'Material',
      width: 200,
      renderCell: (params) => {
        const material = materiais.find(m => String(m.idMaterial) === String(params.row.idMaterial));
        return material ? material.nome : params.row.idMaterial || '';
      }
    },
    { field: 'pesoEnviado', headerName: 'Peso (kg)', width: 120 },
    { field: 'volumeEnviado', headerName: 'Volume (m³)', width: 120 },
    { field: 'data', headerName: 'Data', width: 100 }
  ];

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-3">Materiais Enviados</h2>
      </div>
      <div className="mb-3" />

      <div style={{ width: '100%', marginBottom: 24 }}>
        <DataGrid
          rows={envios}
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

export default ListarMateriaisEnviados;

import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import endpoints from '../services/endpoints';

function MateriaisColetados() {
  const [materiais, setMateriais] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carrega materiais e pedidos de coleta
  const loadMateriais = async () => {
    try {
      const response = await endpoints.materiais.list();
      setMateriais(response.data || []);
    } catch (error) {
      setMateriais([]);
    }
  };

  const loadPedidos = async () => {
    setLoading(true);
    try {
      const response = await endpoints.pedidos.list();
      if (response?.data) {
        // Formata a data já no mapeamento
        const pedidosFormatados = response.data.map((pedido, idx) => {
          let rawData = pedido.data || pedido.dataPedido || pedido.data_pedido || pedido.createdAt || pedido.updatedAt || '';
          let dataFormatada = '';
          if (rawData) {
            const dateObj = new Date(rawData);
            dataFormatada = !isNaN(dateObj) ? dateObj.toLocaleDateString() : rawData;
          }
          return {
            id: pedido.idPedido || pedido.id_pedido || pedido.id || `row-${idx}`,
            idMaterial: pedido.idMaterial || pedido.id_material || '',
            peso: pedido.peso ?? '',
            volume: pedido.volume ?? '',
            data: dataFormatada
          };
        });
        setPedidos(pedidosFormatados);
      } else {
        setPedidos([]);
      }
    } catch (error) {
      setPedidos([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMateriais();
    loadPedidos();
  }, []);

  const columns = [
    {
      field: 'idMaterial',
      headerName: 'Material',
      width: 200,
      renderCell: (params) => {
        // Garante que params.row e idMaterial existam
        if (!params.row || !params.row.idMaterial) return '';
        const material = materiais.find(
          m => String(m.idMaterial ?? m.id_material) === String(params.row.idMaterial)
        );
        return material ? material.nome : params.row.idMaterial || '';
      }
    },
    { field: 'peso', headerName: 'Peso (kg)', width: 120 },
    { field: 'volume', headerName: 'Volume (m³)', width: 140 },
    {
      field: 'data',
      headerName: 'Data',
      width: 160
      // Não use valueGetter aqui
    }
  ];

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-3">Materiais Coletados</h2>
      </div>
      <div className="mb-3" />
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={pedidos}
          columns={columns}
          getRowId={row => row.id}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          autoHeight
          isRowSelectable={() => false}
          loading={loading}
        />
      </div>
    </Container>
  );
}

export default MateriaisColetados;


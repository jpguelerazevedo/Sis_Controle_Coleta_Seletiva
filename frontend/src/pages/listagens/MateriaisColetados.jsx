import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import endpoints from '../../services/endpoints';

function MateriaisColetados() {
  const [materiais, setMateriais] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carrega materiais antes de pedidos
    const fetchAll = async () => {
      await loadMateriais();
    };
    fetchAll();
  }, []);

  useEffect(() => {
    // Só carrega pedidos depois que materiais estiverem carregados
    if (materiais.length > 0) {
      loadPedidos();
    }
    // eslint-disable-next-line
  }, [materiais]);

  const loadMateriais = async () => {
    try {
      const response = await endpoints.materiais.list();
      setMateriais(response.data || []);
    } catch (error) {
      // Apenas alerta, não zera as listas
      // Opcional: alert('Erro ao carregar materiais.');
    }
  };

  const loadPedidos = async () => {
    setLoading(true);
    try {
      const response = await endpoints.pedidos.list();
      if (response?.data) {
        const pedidosFormatados = response.data.map((pedido, idx) => {
          let rawData = pedido.data || pedido.dataPedido || pedido.data_pedido || pedido.createdAt || pedido.updatedAt || '';
          let dataFormatada = '';
          let horaFormatada = '';
          let createdAt = pedido.createdAt || pedido.data || pedido.dataPedido || pedido.data_pedido || pedido.updatedAt || '';
          if (rawData) {
            const dateObj = new Date(rawData);
            if (!isNaN(dateObj)) {
              const dia = String(dateObj.getDate()).padStart(2, '0');
              const mes = String(dateObj.getMonth() + 1).padStart(2, '0');
              const ano = dateObj.getFullYear();
              dataFormatada = `${dia}/${mes}/${ano}`;
              const hora = String(dateObj.getHours()).padStart(2, '0');
              const min = String(dateObj.getMinutes()).padStart(2, '0');
              const seg = String(dateObj.getSeconds()).padStart(2, '0');
              horaFormatada = `${hora}:${min}:${seg}`;
            } else {
              dataFormatada = rawData;
              horaFormatada = '';
            }
          }
          const material = materiais.find(
            m => String(m.idMaterial ?? m.id_material) === String(pedido.idMaterial || pedido.id_material)
          );
          return {
            id: pedido.idPedido || pedido.id_pedido || pedido.id || `row-${idx}`,
            idMaterial: pedido.idMaterial || pedido.id_material || '',
            materialNome: material ? material.nome : '',
            peso: pedido.peso ?? '',
            volume: pedido.volume ?? '',
            data: dataFormatada,
            hora: horaFormatada,
            createdAt: createdAt
          };
        });
        setPedidos(pedidosFormatados);
      } else {
        // Apenas alerta, não zera as listas
        alert('Nenhum pedido encontrado.');
      }
    } catch (error) {
      // Apenas alerta, não zera as listas
      alert('Erro ao carregar pedidos.');
    }
    setLoading(false);
  };

  const columns = [
    {
      field: 'materialNome',
      headerName: 'Material',
      width: 200,
      filterable: true,
    },
    { field: 'peso', headerName: 'Peso (kg)', width: 120 },
    { field: 'volume', headerName: 'Volume (m³)', width: 120 },
    { field: 'data', headerName: 'Data', width: 100 },
    { field: 'hora', headerName: 'Hora', width: 90 }
  ];

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-3">Materiais Coletados</h2>
      </div>
      <div className="mb-3" />

      <div style={{ width: '100%', marginBottom: 24 }}>
        <DataGrid
          rows={[...pedidos].sort((a, b) => {
            // Ordena por createdAt desc (mais recente primeiro)
            if (!a.createdAt) return 1;
            if (!b.createdAt) return -1;
            return new Date(b.createdAt) - new Date(a.createdAt);
          })}
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

export default MateriaisColetados;


import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import endpoints from '../services/endpoints';

function ListarPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [materiais, setMateriais] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMateriais();
    loadClientes();
    loadPedidos();
  }, []);

  const loadMateriais = async () => {
    try {
      const response = await endpoints.materiais.list();
      setMateriais(response.data || []);
    } catch (error) {
      setMateriais([]);
    }
  };

  const loadClientes = async () => {
    try {
      const response = await endpoints.clientes.list();
      setClientes(response.data || []);
    } catch (error) {
      setClientes([]);
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
            id: pedido.idPedido || pedido.id_pedido || pedido.id || `row-${idx}`,
            idMaterial: pedido.idMaterial || pedido.id_material || '',
            cpfCliente: pedido.cpfCliente || pedido.cpf_cliente || '',
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

  const columns = [
    {
      field: 'cpfCliente',
      headerName: 'Cliente',
      width: 200,
      renderCell: (params) => {
        if (!params.row || !params.row.cpfCliente) return '';
        const cliente = clientes.find(
          c => String(c.cpf) === String(params.row.cpfCliente)
        );
        // Mostra apenas o nome do cliente, sem o CPF
        return cliente
          ? (cliente.nome || (cliente.pessoa && cliente.pessoa.nome) || '')
          : '';
      }
    },
    {
      field: 'idMaterial',
      headerName: 'Material',
      width: 200,
      renderCell: (params) => {
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
    }
  ];

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-3">Pedidos</h2>
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

export default ListarPedidos;

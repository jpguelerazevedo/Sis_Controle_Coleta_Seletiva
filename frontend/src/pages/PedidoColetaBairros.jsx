import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import endpoints from '../services/endpoints';

function PedidoColetaBairros() {
  const [bairros, setBairros] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [bairrosResp, clientesResp, pedidosResp] = await Promise.all([
        endpoints.bairros.list(),
        endpoints.clientes.list(),
        endpoints.pedidos.list()
      ]);
      const bairrosData = bairrosResp?.data || [];
      const clientesData = clientesResp?.data || [];
      const pedidosData = pedidosResp?.data || [];

      setBairros(bairrosData);
      setClientes(clientesData);
      setPedidos(pedidosData);

      // Mapeia CPF do cliente para id_bairro
      const cpfToBairro = {};
      clientesData.forEach(cliente => {
        const id_bairro = cliente.id_bairro || (cliente.endereco && cliente.endereco.id_bairro);
        if (cliente.cpf && id_bairro) {
          cpfToBairro[cliente.cpf] = id_bairro;
        }
      });

      // Conta utilizações por bairro nos pedidos
      const bairroCount = {};
      pedidosData.forEach(pedido => {
        const cpf = pedido.cpfCliente || pedido.cpf_cliente;
        const id_bairro = cpfToBairro[cpf];
        if (id_bairro) {
          bairroCount[id_bairro] = (bairroCount[id_bairro] || 0) + 1;
        }
      });

      // Monta linhas para a tabela
      const rowsData = bairrosData.map(bairro => ({
        id: bairro.id_bairro,
        bairro: bairro.nome,
        utilizacao: bairroCount[bairro.id_bairro] || 0
      }));

      setRows(rowsData);
    } catch (error) {
      setRows([]);
    }
    setLoading(false);
  };

  const columns = [
    { field: 'bairro', headerName: 'Bairro', width: 250 },
    { field: 'utilizacao', headerName: 'Utilização', width: 150 }
  ];

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-3">Utilização de Bairros</h2>
      </div>
      <div className="mb-3" />
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={row => row.id}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          disableSelectionOnClick
          autoHeight
          isRowSelectable={() => false}
          loading={loading}
        />
      </div>
    </Container>
  );
}

export default PedidoColetaBairros;

import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import endpoints from '../services/endpoints';

function ListarClientesNovos() {
  const [clientes, setClientes] = useState([]);
  const [bairros, setBairros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClientes();
    loadBairros();
  }, []);

  const loadClientes = async () => {
    setLoading(true);
    try {
      const response = await endpoints.clientes.list();
      if (response?.data) {
        const clientesFormatados = response.data.map((cliente, idx) => {
          // Tenta pegar o campo de data de cadastro
          let rawData = cliente.dataCadastro || cliente.data_cadastro || cliente.createdAt || cliente.updatedAt || '';
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
            id: cliente.cpf,
            nome: cliente.nome || (cliente.pessoa && cliente.pessoa.nome) || '',
            cpf: cliente.cpf,
            id_bairro: cliente.id_bairro || (cliente.endereco && cliente.endereco.id_bairro) || '',
            dataCadastro: dataFormatada
          };
        });
        setClientes(clientesFormatados);
      } else {
        setClientes([]);
      }
    } catch (error) {
      setClientes([]);
    }
    setLoading(false);
  };

  const loadBairros = async () => {
    try {
      const response = await endpoints.bairros.list();
      setBairros(response.data || []);
    } catch (error) {
      setBairros([]);
    }
  };

  const columns = [
    { field: 'nome', headerName: 'Nome', width: 200 },
    { field: 'cpf', headerName: 'CPF', width: 150 },
    {
      field: 'id_bairro',
      headerName: 'Bairro',
      width: 180,
      renderCell: (params) => {
        const bairro = bairros.find(b => String(b.id_bairro) === String(params.row.id_bairro));
        return bairro ? bairro.nome : '';
      }
    },
    { field: 'dataCadastro', headerName: 'Data', width: 160 }
  ];

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-3">Clientes Novos</h2>
      </div>
      <div className="mb-3" />
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={clientes}
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

export default ListarClientesNovos;

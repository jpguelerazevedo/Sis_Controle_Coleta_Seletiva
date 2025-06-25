import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import endpoints from '../../services/endpoints';

function ListarClientesNovos() {
  const [clientes, setClientes] = useState([]);
  const [bairros, setBairros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Carrega bairros primeiro
      const bairrosResponse = await endpoints.bairros.list();
      const bairrosArr = bairrosResponse.data || [];
      setBairros(bairrosArr);

      // Depois carrega clientes
      const clientesResponse = await endpoints.clientes.list();
      if (clientesResponse?.data) {
        const clientesFormatados = clientesResponse.data.map((cliente, idx) => {
          let rawData = cliente.dataCadastro || cliente.data_cadastro || cliente.createdAt || cliente.updatedAt || '';
          let dataFormatada = '';
          let horaFormatada = '';
          let createdAt = cliente.createdAt || cliente.dataCadastro || cliente.data_cadastro || cliente.updatedAt || '';
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
          // Formata o CPF
          const cpfNumerico = (cliente.cpf || '').replace(/\D/g, '');
          const cpfFormatado = cpfNumerico.length === 11
            ? `${cpfNumerico.substring(0, 3)}.${cpfNumerico.substring(3, 6)}.${cpfNumerico.substring(6, 9)}-${cpfNumerico.substring(9, 11)}`
            : cliente.cpf || '';
          // Busca nome do bairro
          const idBairro = cliente.id_bairro || (cliente.endereco && cliente.endereco.id_bairro) || '';
          const bairroObj = bairrosArr.find(b => String(b.id_bairro) === String(idBairro));
          const bairroNome = bairroObj ? bairroObj.nome : '';
          return {
            id: cliente.cpf,
            nome: cliente.nome || (cliente.pessoa && cliente.pessoa.nome) || '',
            cpf: cpfFormatado,
            id_bairro: idBairro,
            bairroNome,
            dataCadastro: dataFormatada,
            hora: horaFormatada,
            createdAt: createdAt
          };
        });
        setClientes(clientesFormatados);
      } else {
        setClientes([]);
      }
    } catch (error) {
      setClientes([]);
      setBairros([]);
    }
    setLoading(false);
  };

  const columns = [
    { field: 'nome', headerName: 'Nome', width: 200 },
    { field: 'cpf', headerName: 'CPF', width: 130 },
    {
      field: 'bairroNome',
      headerName: 'Bairro',
      width: 200,
      filterable: true
    },
    { field: 'dataCadastro', headerName: 'Data', width: 100 },
    { field: 'hora', headerName: 'Hora', width: 90 }
    // Removido o campo 'createdAt' da definição de colunas visíveis
  ];

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-3">Clientes Novos</h2>
      </div>
      <div className="mb-3" />

      <div style={{ width: '100%', marginBottom: 24 }}>
        <DataGrid
          rows={[...clientes].sort((a, b) => {
            // Ordena por createdAt desc (mais recente primeiro)
            if (!a.createdAt) return 1;
            if (!b.createdAt) return -1;
            return new Date(b.createdAt) - new Date(a.createdAt);
          })}
          columns={columns}
          getRowId={row => row.id}
          initialState={{
            pagination: { paginationModel: { pageSize: 5, page: 0 } }
            // Removido sorting do initialState, pois a ordenação é feita manualmente acima
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

export default ListarClientesNovos;

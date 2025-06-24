import { useEffect, useState } from 'react';
import { Row, Col, Card, Badge, ProgressBar, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faRecycle,
  faTruck,
  faBuilding,
  faBoxOpen,
  faCheckCircle,
  faArrowUp
} from '@fortawesome/free-solid-svg-icons';
import endpoints from '../services/endpoints';

function Dashboard() {
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalMateriais: 0,
    totalTerceirizadas: 0,
    totalMateriaisEstoque: 0,
    clientesNovosMes: 0,
  });
  const [recentesPedidos, setRecentesPedidos] = useState([]);
  const [recentesRecebimentos, setRecentesRecebimentos] = useState([]);
  const [recentesEnvios, setRecentesEnvios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totais, setTotais] = useState({
    pedidos: 0,
    recebimentos: 0,
    envios: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        // Clientes
        const clientesResp = await endpoints.clientes.list();
        const clientes = clientesResp?.data || [];
        const clientesNovosMes = clientes.filter(c => {
          if (!c.createdAt) return false;
          const created = new Date(c.createdAt);
          const now = new Date();
          return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
        }).length;

        // Materiais
        const materiaisResp = await endpoints.materiais.list();
        const materiais = materiaisResp?.data || [];
        const totalMateriaisEstoque = materiais.reduce((acc, m) => acc + (parseFloat(m.peso) || 0), 0);

        // Pedidos de Coleta
        const pedidosResp = await endpoints.pedidos?.list?.();
        const pedidos = pedidosResp?.data || [];
        const pedidosOrdenados = pedidos.sort((a, b) => new Date(a.data) - new Date(b.data)); // ordem crescente
        const recentesPedidos = pedidosOrdenados
          .slice(-3)
          .map(p => {
            // Formata o CPF para 000.000.000-00
            const clienteObj = clientes.find(c => c.cpf === p.cpf_cliente);
            let cpfFormatado = p.cpf_cliente;
            if (cpfFormatado && cpfFormatado.length === 11) {
              cpfFormatado = cpfFormatado.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            }
            return {
              tipo: p.status === 'PENDENTE' ? 'Novo pedido' : 'Pedido concluído',
              cliente: clienteObj?.nome
                ? `${clienteObj.nome} (${cpfFormatado})`
                : cpfFormatado,
              data: p.data,
              status: p.status,
              material: materiais.find(m => m.idMaterial === p.idMaterial)?.nome || '',
              peso: p.peso,
              volume: p.volume,
            };
          });

        // Recebimentos de Material
        const recebResp = await endpoints.recebimentos?.list?.();
        const recebimentos = recebResp?.data || [];
        const recebimentosOrdenados = recebimentos.sort((a, b) => new Date(a.data) - new Date(b.data)); // ordem crescente
        const recentesRecebimentos = recebimentosOrdenados
          .slice(-3) // pega os 3 últimos
          .map(r => {
            let cpf = r.cpfCliente || r.cpf_cliente || '';
            if (cpf && cpf.length === 11) {
              cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            }
            return {
              cliente: cpf,
              colaborador: r.cpfColaborador || r.cpf_colaborador,
              data: r.data,
              material: materiais.find(m => m.idMaterial === r.idMaterial)?.nome || '',
              peso: r.peso,
              volume: r.volume,
            };
          });

        // Envios de Material
        const enviosResp = await endpoints.envios?.list?.();
        const envios = enviosResp?.data || [];
        const enviosOrdenados = envios.sort((a, b) => new Date(a.data) - new Date(b.data)); // ordem crescente
        const terceirizadasResp = await endpoints.terceirizadas.list();
        const terceirizadas = terceirizadasResp?.data || [];
        const terceirizadasAtivas = terceirizadas.filter(t => t.estado === 'ativo');
        const recentesEnvios = enviosOrdenados
          .slice(-3) // pega os 3 últimos
          .map(e => {
            let cnpj = e.cnpj || '';
            if (cnpj && cnpj.length === 14) {
              cnpj = cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
            }
            return {
              terceirizada: cnpj,
              data: e.data,
              material: materiais.find(m => m.idMaterial === e.idMaterial)?.nome || '',
              peso: e.pesoEnviado || e.peso_enviado,
              volume: e.volumeEnviado || e.volume_enviado,
            };
          });

        setStats({
          totalClientes: clientes.length,
          totalMateriais: materiais.length,
          totalTerceirizadas: terceirizadasAtivas.length,
          totalMateriaisEstoque,
          clientesNovosMes,
          totalPedidos: pedidos.length,
          totalRecebimentos: recebimentos.length,
          totalEnvios: envios.length,
        });
        setTotais({
          pedidos: pedidos.length,
          recebimentos: recebimentos.length,
          envios: envios.length,
        });
        setRecentesPedidos(recentesPedidos);
        setRecentesRecebimentos(recentesRecebimentos);
        setRecentesEnvios(recentesEnvios);
      } catch (e) {
        setStats({
          totalClientes: 0,
          totalMateriais: 0,
          totalTerceirizadas: 0,
          totalMateriaisEstoque: 0,
          clientesNovosMes: 0,
          totalPedidos: 0,
          totalRecebimentos: 0,
          totalEnvios: 0,
        });
        setTotais({
          pedidos: 0,
          recebimentos: 0,
          envios: 0,
        });
        setRecentesPedidos([]);
        setRecentesRecebimentos([]);
        setRecentesEnvios([]);
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total de Clientes',
      value: stats.totalClientes,
      icon: faUsers,
      color: 'success',
      bg: 'rgba(40,167,69,0.13)', // verde forte
      progress: stats.totalClientes ? Math.min(100, (stats.clientesNovosMes / stats.totalClientes) * 100) : 0,
      footer: `+${stats.clientesNovosMes} este mês`
    },
    {
      title: 'Materiais Cadastrados',
      value: stats.totalMateriais,
      icon: faRecycle,
      color: 'success',
      bg: 'rgba(40,167,69,0.13)', // verde forte
      progress: 100,
      footer: 'Tipos diferentes'
    },
    {
      title: 'Terceirizadas Ativas',
      value: stats.totalTerceirizadas,
      icon: faBuilding,
      color: 'success',
      bg: 'rgba(40,167,69,0.13)', // verde forte
      progress: 100,
      footer: 'Ativas no sistema'
    },
    {
      title: 'Estoque Total (kg)',
      value: stats.totalMateriaisEstoque.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      icon: faBoxOpen,
      color: 'success',
      bg: 'rgba(40,167,69,0.13)', // verde forte
      progress: 100,
      footer: 'Peso total'
    }
  ];

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Dashboard</h2>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
          <Spinner animation="border" variant="success" />
        </div>
      ) : (
        <>
          <Row className="g-4">
            {statCards.map((stat, index) => (
              <Col key={index} md={12} lg={6} xl={3}>
                <Card
                  className="h-100 border-0"
                  style={{

                    borderRadius: 18,
                    background: stat.bg,
                    boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.08)'
                  }}
                >
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div>
                        <h6 className="text-muted mb-1" style={{ fontWeight: 600 }}>{stat.title}</h6>
                        <h2 className={`mb-0 text-${stat.color}`} style={{ fontWeight: 700 }}>{stat.value}</h2>
                      </div>
                      <div
                        style={{
                          background: '#fff',
                          borderRadius: '50%',
                          width: 54,
                          height: 54,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px #0001'
                        }}
                      >
                        <FontAwesomeIcon
                          icon={stat.icon}
                          className={`text-${stat.color}`}
                          size="2x"
                        />
                      </div>
                    </div>
                    <ProgressBar
                      now={stat.progress}
                      variant={stat.color}
                      style={{ height: 6, borderRadius: 3, marginBottom: 8, background: '#e9ecef', boxShadow: '0 1.5px 6px 0 rgba(0,0,0,0.08)' }}
                    />
                    <div className="d-flex justify-content-between align-items-center">
                      <Badge bg={stat.color} style={{ fontSize: 12, fontWeight: 500, opacity: 0.85, boxShadow: '0 2px 8px #0001' }}>
                        {stat.footer}
                      </Badge>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <Row className="mt-4">
            <Col md={12}>
              <h4 className="pb-3">Atividades Recentes</h4>
            </Col>
          </Row>
          <Row className="g-4 mb-4">
            <Col xl={4} md={12}>
              <Card
                className="h-100 border-0"
                style={{
                  borderRadius: 18,
                  background: 'rgba(40,167,69,0.13)',
                  boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.08)'
                }}
              >
                <Card.Body>
                  {/* Pedidos de Coleta */}
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <h6 className="text-success mb-1" style={{ fontWeight: 600 }}>Pedidos de Coleta</h6>
                      <h2 className="mb-0 text-success" style={{ fontWeight: 700 }}>
                        {totais.pedidos}
                      </h2>
                    </div>
                    <div
                      style={{
                        background: '#fff',
                        borderRadius: '50%',
                        width: 54,
                        height: 54,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px #0001'
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faTruck}
                        className="text-success"
                        size="2x"
                      />
                    </div>
                  </div>
                  <ProgressBar
                    now={100}
                    variant="success"
                    style={{ height: 6, borderRadius: 3, marginBottom: 8, background: '#e9ecef', boxShadow: '0 1.5px 6px 0 rgba(0,0,0,0.08)' }}
                  />
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Badge bg="success" style={{ fontSize: 12, fontWeight: 500, opacity: 0.95, boxShadow: '0 2px 8px #0001', backgroundColor: '#28a745' }}>
                      Recentes
                    </Badge>
                  </div>
                  <div className="list-group list-group-flush">
                    {recentesPedidos.length === 0 && (
                      <div className="list-group-item border-0 text-muted bg-transparent">
                        Nenhuma atividade recente encontrada.
                      </div>
                    )}
                    {recentesPedidos.map((item, idx) => (
                      <div key={idx} className="list-group-item border-0 bg-transparent">
                        <p className="mt-3" style={{ marginBottom: 0, borderTop: '1px solid green' }}>
                          CPF: <b>{item.cliente}</b><br />
                          MATERIAL: {item.material || '-'}<br />
                          PESO/VOLUME: {item.peso ? `${item.peso}kg` : '-'} -{item.volume ? ` ${item.volume}m³` : '-'}
                        </p>
                        <small className="text-muted">{item.data ? new Date(item.data).toLocaleString('pt-BR') : ''}</small>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={4} md={12}>
              <Card
                className="h-100 border-0"
                style={{
                  borderRadius: 18,
                  background: 'rgba(40,167,69,0.13)',
                  boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.08)'
                }}
              >
                <Card.Body>
                  {/* Recebimento de Material */}
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <h6 className="text-success mb-1" style={{ fontWeight: 600 }}>Recebimento de Material</h6>
                      <h2 className="mb-0 text-success" style={{ fontWeight: 700 }}>
                        {totais.recebimentos}
                      </h2>
                    </div>
                    <div
                      style={{
                        background: '#fff',
                        borderRadius: '50%',
                        width: 54,
                        height: 54,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px #0001'
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-success"
                        size="2x"
                      />
                    </div>
                  </div>
                  <ProgressBar
                    now={100}
                    variant="success"
                    style={{ height: 6, borderRadius: 3, marginBottom: 8, background: '#e9ecef', boxShadow: '0 1.5px 6px 0 rgba(0,0,0,0.08)' }}
                  />
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Badge bg="success" style={{ fontSize: 12, fontWeight: 500, opacity: 0.95, boxShadow: '0 2px 8px #0001', backgroundColor: '#28a745' }}>
                      Recentes
                    </Badge>
                  </div>
                  <div className="list-group list-group-flush">
                    {recentesRecebimentos.length === 0 && (
                      <div className="list-group-item border-0 text-muted bg-transparent">
                        Nenhum recebimento recente encontrado.
                      </div>
                    )}
                    {recentesRecebimentos.map((item, idx) => (
                      <div key={idx} className="list-group-item border-0 bg-transparent">
                        <p className="mt-3" style={{ marginBottom: 0, borderTop: '1px solid green' }}>
                          CPF: <b>{item.cliente}</b><br />
                          MATERIAL: {item.material || '-'}<br />
                          PESO/VOLUME: {item.peso ? `${item.peso}kg` : '-'} -{item.volume ? ` ${item.volume}m³` : '-'}
                        </p>
                        <small className="text-muted">{item.data ? new Date(item.data).toLocaleString('pt-BR') : ''}</small>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={4} md={12}>
              <Card
                className="h-100 border-0"
                style={{
                  borderRadius: 18,
                  background: 'rgba(40,167,69,0.13)',
                  boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.08)'
                }}
              >
                <Card.Body>
                  {/* Envio de Material */}
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <h6 className="text-success mb-1" style={{ fontWeight: 600 }}>Envio de Material</h6>
                      <h2 className="mb-0 text-success" style={{ fontWeight: 700 }}>
                        {totais.envios}
                      </h2>
                    </div>
                    <div
                      style={{
                        background: '#fff',
                        borderRadius: '50%',
                        width: 54,
                        height: 54,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px #0001'
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faArrowUp}
                        className="text-success"
                        size="2x"
                      />
                    </div>
                  </div>
                  <ProgressBar
                    now={100}
                    variant="success"
                    style={{ height: 6, borderRadius: 3, marginBottom: 8, background: '#e9ecef', boxShadow: '0 1.5px 6px 0 rgba(0,0,0,0.08)' }}
                  />
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Badge bg="success" style={{ fontSize: 12, fontWeight: 500, opacity: 0.95, boxShadow: '0 2px 8px #0001', backgroundColor: '#28a745' }}>
                      Recentes
                    </Badge>
                  </div>
                  <div className="list-group list-group-flush">
                    {recentesEnvios.length === 0 && (
                      <div className="list-group-item border-0 text-muted bg-transparent">
                        Nenhum envio recente encontrado.
                      </div>
                    )}
                    {recentesEnvios.map((item, idx) => (
                      <div key={idx} className="list-group-item border-0 bg-transparent">
                        <p className="mt-3" style={{ marginBottom: 0, borderTop: '1px solid green' }}>
                          TERCEIRIZADA: <b>{item.terceirizada}</b><br />
                          MATERIAL: {item.material || '-'}<br />
                          PESO/VOLUME: {item.peso ? `${item.peso}kg` : '-'} -{item.volume ? ` ${item.volume}m³` : '-'}
                        </p>
                        <small className="text-muted">{item.data ? new Date(item.data).toLocaleString('pt-BR') : ''}</small>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}

export default Dashboard;
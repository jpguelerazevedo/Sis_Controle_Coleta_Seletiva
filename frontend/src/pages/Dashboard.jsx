import { Row, Col, Card, Badge, ProgressBar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faRecycle,
  faTruck,
  faBuilding,
} from '@fortawesome/free-solid-svg-icons';

function Dashboard() {
  // These would typically come from an API
  const stats = [
    {
      title: 'Total de Clientes',
      value: '150',
      icon: faUsers,
      color: 'primary',
      bg: 'rgba(33,150,243,0.1)',
      progress: 80,
      footer: '+12 este mês'
    },
    {
      title: 'Materiais em Estoque',
      value: '1.2 ton',
      icon: faRecycle,
      color: 'success',
      bg: 'rgba(76,175,80,0.1)',
      progress: 60,
      footer: 'Estoque saudável'
    },
    {
      title: 'Pedidos Pendentes',
      value: '23',
      icon: faTruck,
      color: 'warning',
      bg: 'rgba(255,193,7,0.1)',
      progress: 35,
      footer: '5 atrasados'
    },
    {
      title: 'Terceirizadas Ativas',
      value: '5',
      icon: faBuilding,
      color: 'info',
      bg: 'rgba(0,188,212,0.1)',
      progress: 100,
      footer: 'Todas ativas'
    },
  ];

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>

      <Row className="g-4">
        {stats.map((stat, index) => (
          <Col key={index} md={6} lg={3}>
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
        <Col md={8}>
          <Card
            className="border-0 mb-4"
            style={{
              borderRadius: 18,
              boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.08)'
            }}
          >
            <Card.Body>
              <h5 className="card-title">Atividades Recentes</h5>
              <div className="list-group list-group-flush">
                <div className="list-group-item border-0" style={{ background: 'rgba(76,175,80,0.07)', boxShadow: '0 1.5px 6px 0 rgba(0,0,0,0.04)' }}>
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1" style={{ fontWeight: 600 }}>Nova coleta agendada</h6>
                    <Badge bg="success" pill>3 min atrás</Badge>
                  </div>
                  <p className="mb-1">Cliente: <b>João Silva</b> - Bairro: Centro</p>
                </div>
                <div className="list-group-item border-0" style={{ background: 'rgba(33,150,243,0.07)', boxShadow: '0 1.5px 6px 0 rgba(0,0,0,0.04)' }}>
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1" style={{ fontWeight: 600 }}>Material recebido</h6>
                    <Badge bg="primary" pill>1 hora atrás</Badge>
                  </div>
                  <p className="mb-1">Plástico - <b>150kg</b></p>
                </div>
                <div className="list-group-item border-0" style={{ background: 'rgba(255,193,7,0.07)', boxShadow: '0 1.5px 6px 0 rgba(0,0,0,0.04)' }}>
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1" style={{ fontWeight: 600 }}>Novo cliente cadastrado</h6>
                    <Badge bg="warning" pill>2 horas atrás</Badge>
                  </div>
                  <p className="mb-1"><b>Maria Oliveira</b> - Bairro: Jardim América</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card
            className="border-0"
            style={{
              borderRadius: 18,
              boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.08)'
            }}
          >
            <Card.Body>
              <h5 className="card-title">Próximas Coletas</h5>
              <div className="list-group list-group-flush">
                <div className="list-group-item border-0" style={{ background: 'rgba(33,150,243,0.07)', boxShadow: '0 1.5px 6px 0 rgba(0,0,0,0.04)' }}>
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1" style={{ fontWeight: 600 }}>Pedro Santos</h6>
                    <Badge bg="primary" pill>Hoje, 14:00</Badge>
                  </div>
                  <p className="mb-1">Papel e Plástico</p>
                </div>
                <div className="list-group-item border-0" style={{ background: 'rgba(76,175,80,0.07)', boxShadow: '0 1.5px 6px 0 rgba(0,0,0,0.04)' }}>
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1" style={{ fontWeight: 600 }}>Ana Costa</h6>
                    <Badge bg="success" pill>Amanhã, 10:00</Badge>
                  </div>
                  <p className="mb-1">Vidro e Metal</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
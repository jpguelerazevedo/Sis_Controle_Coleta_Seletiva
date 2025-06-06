import { Row, Col, Card } from 'react-bootstrap';
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
    { title: 'Total de Clientes', value: '150', icon: faUsers, color: 'primary' },
    { title: 'Materiais em Estoque', value: '1.2 ton', icon: faRecycle, color: 'success' },
    { title: 'Pedidos Pendentes', value: '23', icon: faTruck, color: 'warning' },
    { title: 'Terceirizadas Ativas', value: '5', icon: faBuilding, color: 'info' },
  ];

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      
      <Row className="g-4">
        {stats.map((stat, index) => (
          <Col key={index} md={6} lg={3}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2">{stat.title}</h6>
                    <h3 className="mb-0">{stat.value}</h3>
                  </div>
                  <div className={`bg-${stat.color} bg-opacity-10 p-3 rounded`}>
                    <FontAwesomeIcon
                      icon={stat.icon}
                      className={`text-${stat.color}`}
                      size="2x"
                    />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mt-4">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="card-title">Atividades Recentes</h5>
              <div className="list-group list-group-flush">
                <div className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">Nova coleta agendada</h6>
                    <small>3 min atrás</small>
                  </div>
                  <p className="mb-1">Cliente: João Silva - Bairro: Centro</p>
                </div>
                <div className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">Material recebido</h6>
                    <small>1 hora atrás</small>
                  </div>
                  <p className="mb-1">Plástico - 150kg</p>
                </div>
                <div className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">Novo cliente cadastrado</h6>
                    <small>2 horas atrás</small>
                  </div>
                  <p className="mb-1">Maria Oliveira - Bairro: Jardim América</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="card-title">Próximas Coletas</h5>
              <div className="list-group list-group-flush">
                <div className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">Pedro Santos</h6>
                    <small>Hoje, 14:00</small>
                  </div>
                  <p className="mb-1">Papel e Plástico</p>
                </div>
                <div className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">Ana Costa</h6>
                    <small>Amanhã, 10:00</small>
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
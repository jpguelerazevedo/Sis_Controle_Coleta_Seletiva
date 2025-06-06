import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUsers,
  faRecycle,
  faTruck,
  faUserTie,
  faBuilding,
} from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/logo.png';
import '../App.css';

function Sidebar({ isCollapsed }) {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: faHome, label: 'Dashboard' },
    { path: '/clientes', icon: faUsers, label: 'Clientes' },
    { path: '/materiais', icon: faRecycle, label: 'Materiais' },
    { path: '/pedidos-coleta', icon: faTruck, label: 'Pedidos de Coleta' },
    { path: '/colaboradores', icon: faUserTie, label: 'Colaboradores' },
    { path: '/terceirizadas', icon: faBuilding, label: 'Terceirizadas' },
  ];

  return (
    <div
      className={`sidebar d-flex flex-column flex-shrink-0 p-3 text-white bg-dark ${isCollapsed ? 'collapsed' : ''}`}
    >
      <div className="d-flex align-items-center justify-content-center p-1">
          <img src={logo} alt="Logo" className="logo" />
      </div>
      <hr />
      <Nav variant="pills" className="flex-column mb-auto align-items-start">
        {menuItems.map((item) => (
          <Nav.Item key={item.path} className="w-100">
            <Nav.Link
              as={Link}
              to={item.path}
              className={
                `text-start ${location.pathname === item.path ? 'active' : 'text-white'}`
              }
            >
              <FontAwesomeIcon icon={item.icon} className="me-2" />
              {item.label}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
}

export default Sidebar;
import { Nav, Dropdown } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUsers,
  faRecycle,
  faTruck,
  faBuilding,
  faMapMarkedAlt,
  faIdCard,
  faArrowDown,
  faArrowUp,
  faMedal,
  faTools,
  faList // Novo ícone para serviços
} from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/logo.png';
import '../App.css';
import { useState, useEffect } from 'react';

function Sidebar({ isCollapsed }) {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { path: '/', icon: faHome, label: 'DASHBOARD' },
    { path: '/clientes', icon: faUsers, label: 'CLIENTES' },
    { path: '/materiais', icon: faRecycle, label: 'MATERIAIS' },
    { path: '/colaboradores', icon: faIdCard, label: 'COLABORADORES' },
    { path: '/cargos', icon: faMedal, label: 'CARGOS' },
    { path: '/terceirizadas', icon: faBuilding, label: 'TERCEIRIZADAS' },
    { path: '/bairros', icon: faMapMarkedAlt, label: 'BAIRROS' },
    // Serviços será um dropdown com ícone melhor
    {
      dropdown: true, label: 'SERVIÇOS', icon: faTools, items: [
        { path: '/pedidos-coleta', icon: faTruck, label: 'Pedidos de Coleta' },
        { path: '/recebimentos-material', icon: faArrowDown, label: 'Recebimentos Material' },
        { path: '/envios-material', icon: faArrowUp, label: 'Envios Material' },
      ]
    },
    {
      dropdown: true, label: 'LISTAGENS', icon: faList, items: [
        { path: '/materiais-coletados', icon: faRecycle, label: 'Materiais Coletados' },
        { path: '/pedido-coleta-bairros', icon: faMapMarkedAlt, label: 'Utilização de Bairros' },
        { path: '/listar-pedidos', icon: faList, label: 'Pedidos' },
        { path: '/listar-materiais', icon: faRecycle, label: 'Materiais' },
        { path: '/listar-materiais-enviados', icon: faArrowUp, label: 'Materiais Enviados' },
        { path: '/listar-clientes-novos', icon: faUsers, label: 'Clientes Novos' },
      ]
    }


  ];

  return (
    <>
      {/* Overlay para escurecer o fundo e bloquear interação quando sidebar aberta no mobile */}
      {isMobile && !isCollapsed && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.4)',
            zIndex: 1039, // abaixo da sidebar (1040)

          }}
        />
      )}
      <div
        className={`sidebar d-flex flex-column flex-shrink-0 p-3 text-white ${isCollapsed && isMobile ? 'collapsed' : ''}`}
        style={{
          backgroundColor: '#549d55',
          position: 'fixed',
          top: 0,
          left: isMobile
            ? (isCollapsed ? '-250px' : '0')
            : '0',
          height: '100vh',
          width: '250px',
          transition: isMobile && !window.__sidebarNoTransition ? 'left 0.3s' : 'none',
          zIndex: 1040,
        }}
        onMouseDown={() => { window.__sidebarNoTransition = true; }}
        onMouseUp={() => { window.__sidebarNoTransition = false; }}
        onMouseLeave={() => { window.__sidebarNoTransition = false; }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          {!isMobile && (
            <div className="d-flex align-items-center justify-content-center p-1">
              <img src={logo} alt="Logo" className="logo" />
            </div>
          )}
          <hr />
          <Nav
            variant="pills"
            className="flex-column mb-auto align-items-start"
            style={{
              paddingTop: isMobile ? '2rem' : 0
            }}
          >
            {menuItems.map((item, idx) =>
              item.dropdown ? (
                <Dropdown
                  key={`dropdown-${idx}`}
                  className="w-100" // Espaçamento extra no topo do dropdown
                >
                  <Dropdown.Toggle
                    variant="success"
                    className="w-100 text-start"
                    style={{ background: 'transparent', border: 'none', color: 'white', fontWeight: 500 }}
                  >
                    <FontAwesomeIcon icon={item.icon} className="me-2" />
                    {item.label}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-100">
                    {item.items.map((sub, subIdx) => (
                      <Dropdown.Item
                        as={Link}
                        to={sub.path}
                        key={sub.path}
                        active={location.pathname === sub.path}
                        className="d-flex align-items-center"
                        style={{ fontWeight: 500 }}
                      >
                        <FontAwesomeIcon icon={sub.icon} className="me-2" />
                        {sub.label}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Nav.Item
                  key={item.path}
                  className={`w-100${item.path === '/bairros' ? ' pb-5' : ''}`}
                >
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
              )
            )}
          </Nav>
        </div>
      </div>
      {/* Logo de fundo centralizado no body */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 0
        }}
      >
        <img
          src={logo}
          alt="Logo background"
          style={{
            opacity: 0.07,
            width: '55vw', // aumentado de 40vw para 55vw
            maxWidth: 700, // aumentado de 500 para 700
            minWidth: 250, // aumentado de 200 para 250
            height: 'auto',
            objectFit: 'contain'
          }}
        />
      </div>
    </>
  );
}

export default Sidebar;
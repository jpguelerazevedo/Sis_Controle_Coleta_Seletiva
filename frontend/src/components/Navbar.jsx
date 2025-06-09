import { useState, useEffect } from 'react';
import { Navbar as BootstrapNavbar, Container, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import '../App.css'; // Import App.css for navbar styles

// Receive toggleSidebar and isSidebarCollapsed props
function Navbar({ toggleSidebar, isSidebarCollapsed }) {
  // Largura da sidebar (manter consistente com Sidebar.jsx e App.css)
  const sidebarWidth = '250px';

  const mdBreakpoint = 768; // Bootstrap's md breakpoint
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < mdBreakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < mdBreakpoint);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  return (
    <BootstrapNavbar
      className={`navbar bg-light shadow-sm ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1050,
        width: '100%',
        marginLeft: isSmallScreen ? 0 : '250px', // Atualize para 250px para combinar com a sidebar maior
        transition: 'margin-left 0.3s',
      }}
    >
      <Container fluid>
        {/* Toggle button for sidebar - visible only on small screens */}
        <Button variant="outline-secondary" onClick={toggleSidebar} className="d-md-none me-2">
          <FontAwesomeIcon icon={faBars} />
        </Button>
        <BootstrapNavbar.Brand href="#home">
          {isSmallScreen ? 'SCCS' : 'SISTEMA DE CONTROLE DE COLETA SELETIVA'}
        </BootstrapNavbar.Brand>
        {/* Add other navbar items here if needed */}
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;
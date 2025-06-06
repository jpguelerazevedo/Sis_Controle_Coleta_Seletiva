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
    // Use navbar class for fixed positioning via CSS
    // Add sidebar-collapsed class to adjust position when sidebar is collapsed
    <BootstrapNavbar className={`navbar bg-light shadow-sm ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Container fluid>
        {/* Toggle button for sidebar - visible only on small screens */}
        <Button variant="outline-secondary" onClick={toggleSidebar} className="d-md-none me-2">
          <FontAwesomeIcon icon={faBars} />
        </Button>
        <BootstrapNavbar.Brand href="#home">
          {isSmallScreen ? 'SCV' : 'Sistema de Controle de Veículos'}
        </BootstrapNavbar.Brand>
        {/* Add other navbar items here if needed */}
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar; 
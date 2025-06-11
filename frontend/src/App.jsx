import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import PedidosColeta from './pages/PedidosColeta';
import Colaboradores from './pages/Colaboradores';
import Terceirizadas from './pages/Terceirizadas';
import Materiais from './pages/Materiais';
import Bairros from './pages/Bairros';
import Pessoas from './pages/Pessoas';
import RecebimentosMaterial from './pages/RecebimentosMaterial';
import EnviosMaterial from './pages/EnviosMaterial';
import Cargos from './pages/Cargos';
import './App.css';

function App() {
  const mdBreakpoint = 768; // Define the md breakpoint
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth < mdBreakpoint);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  useEffect(() => {
    const handleResize = () => {
      // If screen is small, collapse sidebar. If large, expand it.
      if (window.innerWidth >= mdBreakpoint) {
        setIsSidebarCollapsed(false); // Auto-expand on large screens
      } else {
        setIsSidebarCollapsed(true); // Auto-collapse on small screens
      }
    };

    // Set initial state on mount
    handleResize();

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  return (
    <Router>
      {/* Sidebar */}
      <Sidebar isCollapsed={isSidebarCollapsed} />

      {/* Navbar and Main Content Wrapper */}
      {/* Apply class based on sidebar state to adjust layout */}
      <div className={`main-content-wrapper ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />

        {/* Page content area - scrolls vertically */}
        <div className="content-area">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/materiais" element={<Materiais />} />
            <Route path="/cargos" element={<Cargos />} />
            <Route path="/pedidos-coleta" element={<PedidosColeta />} />
            <Route path="/colaboradores" element={<Colaboradores />} />
            <Route path="/terceirizadas" element={<Terceirizadas />} />
            <Route path="/bairros" element={<Bairros />} />
            <Route path="/pessoas" element={<Pessoas />} />
            <Route path="/recebimentos-material" element={<RecebimentosMaterial />} />
            <Route path="/envios-material" element={<EnviosMaterial />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

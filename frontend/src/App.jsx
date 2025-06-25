import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import PedidosColeta from './pages/servicos/PedidosColeta';
import Colaboradores from './pages/Colaboradores';
import Terceirizadas from './pages/Terceirizadas';
import Materiais from './pages/Materiais';
import Bairros from './pages/Bairros';
// import Pessoas from './pages/Pessoas';
import RecebimentosMaterial from './pages/servicos/RecebimentosMaterial';
import EnviosMaterial from './pages/servicos/EnviosMaterial';
import Cargos from './pages/Cargos';
import MateriaisColetados from './pages/listagens/MateriaisColetados';
import PedidoColetaBairros from './pages/listagens/PedidoColetaBairros';
import ListarClientesNovos from './pages/listagens/ListarClientesNovos';
import './App.css';

function App() {
  const mdBreakpoint = 768; // Define the md breakpoint
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth < mdBreakpoint);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= mdBreakpoint) {
        setIsSidebarCollapsed(false); // Auto-expand on large screens
      } else {
        setIsSidebarCollapsed(true); // Auto-collapse on small screens
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Router>
      <Sidebar isCollapsed={isSidebarCollapsed} />

      <div className={`main-content-wrapper ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />

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
            {/* <Route path="/pessoas" element={<Pessoas />} /> */}
            <Route path="/recebimentos-material" element={<RecebimentosMaterial />} />
            <Route path="/envios-material" element={<EnviosMaterial />} />
            <Route path="/materiais-coletados" element={<MateriaisColetados />} />
            <Route path="/pedido-coleta-bairros" element={<PedidoColetaBairros />} />
            <Route path="/listar-clientes-novos" element={<ListarClientesNovos />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CRM from './pages/CRM';
import Inventario from './pages/Inventario';
import Cotizacion from './pages/Cotizacion';
import PedidoMaterial from './pages/PedidoMaterial';
import Proveedores from './pages/Proveedores';
import AvisoPrivacidad from './components/AvisoPrivacidad';
import './index.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/crm" element={<CRM />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/cotizacion" element={<Cotizacion />} />
        <Route path="/pedido-material" element={<PedidoMaterial />} />
        <Route path="/proveedores" element={<Proveedores />} />
        <Route path="/aviso-privacidad" element={<AvisoPrivacidad />} />
      </Routes>
    </Router>
  );
}

export default App;



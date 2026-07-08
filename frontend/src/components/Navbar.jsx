import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        Taller Granito y Mármol
      </NavLink>
      <div className="navbar-links">
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          end
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="/crm" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          CRM
        </NavLink>
        <NavLink 
          to="/inventario" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Inventario
        </NavLink>
        <NavLink 
          to="/cotizacion" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Cotización
        </NavLink>
        <NavLink 
          to="/pedido-material" 
          className={({ isActive }) => isActive ? 'nav-link nav-link-pedido active' : 'nav-link nav-link-pedido'}
        >
          Pedidos
        </NavLink>
        <NavLink 
          to="/proveedores" 
          className={({ isActive }) => isActive ? 'nav-link nav-link-proveedor active' : 'nav-link nav-link-proveedor'}
        >
          Proveedores
        </NavLink>
        <NavLink 
          to="/aviso-privacidad" 
          className={({ isActive }) => isActive ? 'nav-link nav-link-privacy active' : 'nav-link nav-link-privacy'}
        >
          Privacidad
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;

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
          CRM (Clientes)
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
          to="/aviso-privacidad" 
          className={({ isActive }) => isActive ? 'nav-link nav-link-privacy active' : 'nav-link nav-link-privacy'}
        >
          Aviso de Privacidad
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;

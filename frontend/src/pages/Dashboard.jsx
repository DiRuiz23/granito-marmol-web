import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="container">
      <div className="glass-card" style={{ marginBottom: '2rem', textAlign: 'center', padding: '3rem' }}>
        <h1>Panel de Administración General</h1>
        <p style={{ maxWidth: '600px', margin: '0 auto 1.5rem' }}>
          Taller de Granito, Mármol y Cuarzo. Gestione sus inventarios, cotizaciones y clientes de forma segura.
        </p>
        <Link to="/crm" className="btn btn-primary" style={{ maxWidth: '250px', textDecoration: 'none', display: 'inline-block' }}>
          Ir a CRM (Clientes)
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card">
          <h3>Clientes Registrados</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)', margin: '1rem 0' }}>142</p>
          <p style={{ fontSize: '0.85rem' }}>Clientes con consentimiento activo y firmado.</p>
        </div>
        <div className="glass-card">
          <h3>Materiales en Stock</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent)', margin: '1rem 0' }}>38 m²</p>
          <p style={{ fontSize: '0.85rem' }}>Granito Gris Oxford, Blanco Dallas, Mármol Carrara.</p>
        </div>
        <div className="glass-card">
          <h3>Cotizaciones del Mes</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f59e0b', margin: '1rem 0' }}>29</p>
          <p style={{ fontSize: '0.85rem' }}>8 generadas en la última semana.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

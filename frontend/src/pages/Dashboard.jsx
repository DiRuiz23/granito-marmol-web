import React from 'react';
import { Link } from 'react-router-dom';
import { obtenerEstadisticas, verificarAlertasStock } from '../services/inventarioService';
import { obtenerEstadisticasProveedores } from '../services/proveedorService';

const Dashboard = () => {
  const invStats = obtenerEstadisticas();
  const provStats = obtenerEstadisticasProveedores();
  const alertas = verificarAlertasStock();

  const accesos = [
    { to: '/crm', label: 'CRM (Clientes)', icon: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2', color: 'var(--primary)' },
    { to: '/inventario', label: 'Inventario', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', color: 'var(--accent)' },
    { to: '/cotizacion', label: 'Cotización', icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z', color: 'var(--accent-gold)' },
    { to: '/pedido-material', label: 'Pedido Material', icon: 'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18', color: '#a78bfa' },
    { to: '/proveedores', label: 'Proveedores', icon: 'M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M8.5 3A4 4 0 1012.5 7 4 4 0 008.5 3M20 8v6M23 11h-6', color: '#f472b6' },
  ];

  return (
    <div className="container">
      {/* Hero */}
      <div className="glass-card" style={{ marginBottom: '2rem', textAlign: 'center', padding: '3rem' }}>
        <h1>Panel de Administración General</h1>
        <p style={{ maxWidth: '600px', margin: '0 auto 1.5rem' }}>
          Taller de Granito, Mármol y Cuarzo. Gestione sus inventarios, cotizaciones, clientes y proveedores.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/crm" className="btn btn-primary" style={{ maxWidth: '200px', textDecoration: 'none', display: 'inline-block' }}>
            Ir a CRM
          </Link>
          <Link to="/proveedores" className="btn" style={{ maxWidth: '200px', textDecoration: 'none', display: 'inline-block', border: '1px solid var(--accent-gold)', color: 'var(--accent-gold)', background: 'rgba(245, 158, 11, 0.08)' }}>
            Ir a Proveedores
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card">
          <h3>Clientes Registrados</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)', margin: '1rem 0' }}>142</p>
          <p style={{ fontSize: '0.85rem' }}>Clientes con consentimiento activo.</p>
        </div>
        <div className="glass-card">
          <h3>Materiales en Stock</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent)', margin: '1rem 0' }}>{invStats.totalStock} m²</p>
          <p style={{ fontSize: '0.85rem' }}>{invStats.totalMateriales} tipos de material.</p>
        </div>
        <div className="glass-card">
          <h3>Valor del Inventario</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-gold)', margin: '1rem 0' }}>${(invStats.valorTotal / 1000).toFixed(0)}k</p>
          <p style={{ fontSize: '0.85rem' }}>Valor total estimado en MXN.</p>
        </div>
        <div className="glass-card">
          <h3>Proveedores Activos</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f472b6', margin: '1rem 0' }}>{provStats.activos}</p>
          <p style={{ fontSize: '0.85rem' }}>{provStats.alertasEnviadas} alertas enviadas.</p>
        </div>
      </div>

      {/* Alertas de stock */}
      {alertas.length > 0 && (
        <div className="glass-card dash-alert-card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div>
              <h3 style={{ margin: 0 }}>Alertas de Stock ({alertas.length})</h3>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>Materiales con stock bajo que requieren reabastecimiento.</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {alertas.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.8rem', background: 'rgba(239, 68, 68, 0.06)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.12)' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.nombre}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ color: item.stock <= 3 ? 'var(--danger)' : 'var(--accent-gold)', fontWeight: 700 }}>
                    {item.stock} m²
                  </span>
                  <Link to="/inventario" style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none' }}>
                    Ver →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accesos directos */}
      <div className="glass-card">
        <h3 style={{ marginBottom: '1.25rem' }}>Accesos Directos</h3>
        <div className="dash-shortcuts">
          {accesos.map((acc) => (
            <Link to={acc.to} className="dash-shortcut-card" key={acc.to} style={{ textDecoration: 'none' }}>
              <div className="dash-shortcut-icon" style={{ background: `${acc.color}15`, color: acc.color, border: `1px solid ${acc.color}30` }}>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d={acc.icon} />
                </svg>
              </div>
              <span className="dash-shortcut-label">{acc.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

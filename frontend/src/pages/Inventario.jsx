import React, { useState, useCallback } from 'react';
import {
  obtenerInventario,
  actualizarStock,
  getEstadoStock,
  obtenerEstadisticas,
  obtenerHistorialAlertas,
  registrarAlertaAutomatica,
} from '../services/inventarioService';
import { buscarProveedorPorMaterial } from '../services/proveedorService';

const Inventario = () => {
  const [inventario, setInventario] = useState(obtenerInventario());
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [alertas, setAlertas] = useState(obtenerHistorialAlertas());
  const [alertaNueva, setAlertaNueva] = useState(null);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  const stats = obtenerEstadisticas();

  const refrescarInventario = useCallback(() => {
    setInventario(obtenerInventario());
    setAlertas(obtenerHistorialAlertas());
  }, []);

  const handleStockChange = (materialId, delta) => {
    const item = inventario.find((m) => m.id === materialId);
    if (!item) return;

    const nuevoStock = Math.max(0, item.stock + delta);
    actualizarStock(materialId, nuevoStock);

    // Verificar si debe enviar alerta automática
    if (nuevoStock <= item.umbralAlerta && nuevoStock > 0) {
      const prov = buscarProveedorPorMaterial(materialId);
      if (prov) {
        const alerta = registrarAlertaAutomatica(prov.id, materialId, nuevoStock);
        if (alerta) {
          setAlertaNueva(alerta);
          setTimeout(() => setAlertaNueva(null), 5000);
        }
      }
    }

    refrescarInventario();
  };

  // Filtrar inventario
  const inventarioFiltrado = inventario.filter((item) => {
    const matchTipo = filtroTipo === 'Todos' || item.tipo === filtroTipo;
    const matchBusqueda = item.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return matchTipo && matchBusqueda;
  });

  const tipos = ['Todos', 'Granito', 'Mármol', 'Cuarzo'];

  return (
    <div className="container">
      {/* Alerta de email enviado */}
      {alertaNueva && (
        <div className="restock-notification" id="restock-alert">
          <div className="restock-notification-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <div>
            <strong>Alerta de Restock Enviada</strong>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem' }}>
              ⚠️ {alertaNueva.material}: {alertaNueva.stockAlMomento} m² restantes → Email enviado a{' '}
              <strong>{alertaNueva.proveedor}</strong> ({alertaNueva.email})
            </p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="inv-stats-grid">
        <div className="glass-card inv-stat-card">
          <div className="inv-stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)' }}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <span className="inv-stat-number">{stats.totalMateriales}</span>
            <span className="inv-stat-label">Materiales</span>
          </div>
        </div>
        <div className="glass-card inv-stat-card">
          <div className="inv-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent)' }}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <div>
            <span className="inv-stat-number">{stats.totalStock} m²</span>
            <span className="inv-stat-label">Stock Total</span>
          </div>
        </div>
        <div className="glass-card inv-stat-card">
          <div className="inv-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-gold)' }}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
          </div>
          <div>
            <span className="inv-stat-number">${stats.valorTotal.toLocaleString('es-MX')}</span>
            <span className="inv-stat-label">Valor Total</span>
          </div>
        </div>
        <div className="glass-card inv-stat-card">
          <div
            className="inv-stat-icon"
            style={{
              background: stats.criticos > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
              color: stats.criticos > 0 ? 'var(--danger)' : 'var(--accent)',
            }}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div>
            <span className="inv-stat-number">{stats.enAlerta}</span>
            <span className="inv-stat-label">En Alerta</span>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="glass-card" style={{ marginTop: '1.5rem' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>Inventario de Piedras Naturales</h1>
            <p style={{ marginBottom: 0 }}>Gestione el stock de materiales. Las alertas se envían automáticamente a proveedores.</p>
          </div>
          <button
            className="btn"
            onClick={() => setMostrarHistorial(!mostrarHistorial)}
            style={{
              width: 'auto',
              padding: '0.6rem 1rem',
              fontSize: '0.85rem',
              background: 'rgba(245, 158, 11, 0.1)',
              color: 'var(--accent-gold)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
            }}
          >
            {mostrarHistorial ? 'Ocultar' : 'Ver'} Historial de Alertas ({alertas.length})
          </button>
        </div>

        {/* Historial de alertas expandible */}
        {mostrarHistorial && (
          <div className="alertas-historial">
            <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Historial de Alertas Enviadas</h4>
            {alertas.length === 0 ? (
              <p style={{ fontSize: '0.85rem' }}>No hay alertas registradas.</p>
            ) : (
              <div className="alertas-list">
                {alertas.slice(0, 10).map((a) => (
                  <div className="alerta-item" key={a.id}>
                    <span className={`alerta-tipo-badge ${a.tipo}`}>
                      {a.tipo === 'automatica' ? '⚡ Auto' : '👤 Manual'}
                    </span>
                    <span className="alerta-material">{a.material}</span>
                    <span className="alerta-info">
                      Stock: {a.stockAlMomento} m² → {a.proveedor}
                    </span>
                    <span className="alerta-fecha">
                      {new Date(a.fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Filtros */}
        <div className="inv-filters">
          <div className="inv-search-box">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Buscar material..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="inv-search-input"
            />
          </div>
          <div className="inv-filter-pills">
            {tipos.map((tipo) => (
              <button
                key={tipo}
                className={`inv-pill ${filtroTipo === tipo ? 'active' : ''}`}
                onClick={() => setFiltroTipo(tipo)}
              >
                {tipo}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla de inventario */}
        <div className="inv-table-wrapper">
          <table className="inv-table">
            <thead>
              <tr>
                <th>Material</th>
                <th>Tipo</th>
                <th>Stock</th>
                <th>Precio/m²</th>
                <th>Proveedor</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {inventarioFiltrado.map((item) => {
                const estado = getEstadoStock(item.stock, item.umbralAlerta);
                return (
                  <tr key={item.id} className={estado.clase === 'critico' || estado.clase === 'agotado' ? 'row-alert' : ''}>
                    <td>
                      <strong>{item.nombre}</strong>
                    </td>
                    <td>
                      <span className={`inv-tipo-badge tipo-${item.tipo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`}>
                        {item.tipo}
                      </span>
                    </td>
                    <td>
                      <div className="stock-display">
                        <span className="stock-number" style={{ color: estado.color }}>
                          {item.stock}
                        </span>
                        <span className="stock-unit">{item.unidad}</span>
                      </div>
                      <div className="stock-bar">
                        <div
                          className="stock-bar-fill"
                          style={{
                            width: `${Math.min(100, (item.stock / 20) * 100)}%`,
                            background: estado.color,
                          }}
                        />
                      </div>
                    </td>
                    <td>${item.precioUnitario.toLocaleString('es-MX')}</td>
                    <td>
                      <span style={{ fontSize: '0.85rem' }}>{item.proveedor}</span>
                    </td>
                    <td>
                      <span className={`inv-status-badge status-${estado.clase}`}>
                        {estado.label}
                      </span>
                    </td>
                    <td>
                      <div className="stock-controls">
                        <button
                          className="stock-btn stock-btn-minus"
                          onClick={() => handleStockChange(item.id, -1)}
                          disabled={item.stock === 0}
                          title="Reducir stock"
                        >
                          −
                        </button>
                        <button
                          className="stock-btn stock-btn-plus"
                          onClick={() => handleStockChange(item.id, 1)}
                          title="Aumentar stock"
                        >
                          +
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventario;

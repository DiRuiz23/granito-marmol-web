import React, { useState } from 'react';
import {
  obtenerProveedores,
  crearProveedor,
  eliminarProveedor,
  obtenerHistorialAlertas,
  enviarAlertaRestock,
  NOMBRES_MATERIALES,
} from '../services/proveedorService';
import { CATALOGO_MATERIALES } from '../services/pedidoService';

const formVacio = {
  empresa: '',
  contacto: '',
  email: '',
  telefono: '',
  direccion: '',
  rfc: '',
  materiales: [],
  umbralAlerta: 5,
  notas: '',
};

const Proveedores = () => {
  const [proveedores, setProveedores] = useState(obtenerProveedores());
  const [historial, setHistorial] = useState(obtenerHistorialAlertas());
  const [formData, setFormData] = useState({ ...formVacio });
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [alertaEnviada, setAlertaEnviada] = useState(null);

  const refrescar = () => {
    setProveedores(obtenerProveedores());
    setHistorial(obtenerHistorialAlertas());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleMaterialToggle = (materialId) => {
    const current = formData.materiales;
    const updated = current.includes(materialId)
      ? current.filter((m) => m !== materialId)
      : [...current, materialId];
    setFormData({ ...formData, materiales: updated });
    if (errors.materiales) setErrors({ ...errors, materiales: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.empresa.trim()) newErrors.empresa = 'Nombre de empresa requerido.';
    if (!formData.contacto.trim()) newErrors.contacto = 'Nombre de contacto requerido.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email requerido.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido.';
    }
    if (!formData.telefono.trim()) newErrors.telefono = 'Teléfono requerido.';
    if (formData.materiales.length === 0) newErrors.materiales = 'Seleccione al menos un material.';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSuccessMsg('');
      return;
    }
    setErrors({});

    crearProveedor({
      ...formData,
      umbralAlerta: parseInt(formData.umbralAlerta) || 5,
    });

    setSuccessMsg(`¡Proveedor "${formData.empresa}" registrado exitosamente!`);
    setFormData({ ...formVacio });
    refrescar();

    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleEliminar = (id, nombre) => {
    if (!window.confirm(`¿Eliminar al proveedor "${nombre}"? Esta acción no se puede deshacer.`)) return;
    eliminarProveedor(id);
    refrescar();
  };

  const handleEnviarAlerta = (proveedorId, materialId) => {
    const alerta = enviarAlertaRestock(proveedorId, materialId, 0);
    if (alerta) {
      setAlertaEnviada(alerta);
      refrescar();
      setTimeout(() => setAlertaEnviada(null), 4000);
    }
  };

  // Agrupar materiales por tipo para checkboxes
  const materialesPorTipo = CATALOGO_MATERIALES.reduce((acc, mat) => {
    if (!acc[mat.tipo]) acc[mat.tipo] = [];
    acc[mat.tipo].push(mat);
    return acc;
  }, {});

  return (
    <div className="container">
      {/* Alerta de email enviado */}
      {alertaEnviada && (
        <div className="restock-notification" id="proveedor-alert">
          <div className="restock-notification-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <div>
            <strong>Email de Restock Enviado</strong>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem' }}>
              📧 Solicitud enviada a <strong>{alertaEnviada.proveedor}</strong> ({alertaEnviada.email}) para {alertaEnviada.material}
            </p>
          </div>
        </div>
      )}

      <div className="crm-layout-grid" style={{ gridTemplateColumns: '1fr 1.2fr' }}>
        {/* Columna Izquierda: Formulario */}
        <div className="glass-card">
          <div className="card-header">
            <h1>Registrar Proveedor</h1>
            <p>Agregue proveedores y asocie los materiales que suministran.</p>
          </div>

          {successMsg && (
            <div className="alert-success" style={{ animation: 'fadeInScale 0.3s ease' }}>
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-section-title">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
              </svg>
              <span>Datos de la Empresa</span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="prov-empresa">Nombre de la Empresa *</label>
              <input type="text" id="prov-empresa" name="empresa" className="form-control" placeholder="Ej. Piedras del Norte S.A." value={formData.empresa} onChange={handleChange} />
              {errors.empresa && <span className="field-error">{errors.empresa}</span>}
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="prov-contacto">Nombre del Contacto *</label>
                <input type="text" id="prov-contacto" name="contacto" className="form-control" placeholder="Nombre completo" value={formData.contacto} onChange={handleChange} />
                {errors.contacto && <span className="field-error">{errors.contacto}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="prov-rfc">RFC</label>
                <input type="text" id="prov-rfc" name="rfc" className="form-control" placeholder="ABC123456XY1" value={formData.rfc} onChange={handleChange} />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="prov-email">Correo Electrónico *</label>
                <input type="email" id="prov-email" name="email" className="form-control" placeholder="correo@proveedor.mx" value={formData.email} onChange={handleChange} />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="prov-telefono">Teléfono *</label>
                <input type="tel" id="prov-telefono" name="telefono" className="form-control" placeholder="442 812 3456" value={formData.telefono} onChange={handleChange} />
                {errors.telefono && <span className="field-error">{errors.telefono}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="prov-direccion">Dirección</label>
              <input type="text" id="prov-direccion" name="direccion" className="form-control" placeholder="Dirección completa" value={formData.direccion} onChange={handleChange} />
            </div>

            {/* Materiales que suministra */}
            <div className="form-section-title" style={{ marginTop: '0.5rem' }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span>Materiales que Suministra *</span>
            </div>

            {errors.materiales && (
              <div style={{ marginBottom: '1rem' }}>
                <span className="field-error">{errors.materiales}</span>
              </div>
            )}

            <div className="prov-materiales-grid">
              {Object.entries(materialesPorTipo).map(([tipo, materiales]) => (
                <div key={tipo} className="prov-material-group">
                  <h4 className="prov-material-tipo">{tipo}</h4>
                  {materiales.map((mat) => (
                    <label key={mat.id} className="prov-material-check">
                      <input
                        type="checkbox"
                        checked={formData.materiales.includes(mat.id)}
                        onChange={() => handleMaterialToggle(mat.id)}
                        className="checkbox-input"
                      />
                      <span>{mat.nombre}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>

            {/* Umbral de alerta */}
            <div className="form-group" style={{ marginTop: '1.25rem' }}>
              <label className="form-label" htmlFor="prov-umbral">Umbral de Alerta (piezas/m²)</label>
              <select id="prov-umbral" name="umbralAlerta" className="form-control" value={formData.umbralAlerta} onChange={handleChange}>
                <option value="3">3 — Alerta Crítica</option>
                <option value="5">5 — Alerta Preventiva</option>
                <option value="10">10 — Alerta Anticipada</option>
              </select>
              <p style={{ fontSize: '0.78rem', marginTop: '0.35rem', color: 'var(--text-secondary)' }}>
                Se enviará un email automático al proveedor cuando el stock de sus materiales baje de este valor.
              </p>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="prov-notas">Notas / Condiciones</label>
              <textarea id="prov-notas" name="notas" className="form-control" rows="2" placeholder="Tiempos de entrega, pedido mínimo..." value={formData.notas} onChange={handleChange} style={{ resize: 'vertical', minHeight: '60px' }} />
            </div>

            <button type="submit" className="btn btn-primary btn-glowing" id="btn-registrar-proveedor">
              Registrar Proveedor
            </button>
          </form>
        </div>

        {/* Columna Derecha: Lista de proveedores */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ margin: 0 }}>Proveedores Registrados ({proveedores.length})</h2>
              <button
                className="btn"
                onClick={() => setMostrarHistorial(!mostrarHistorial)}
                style={{
                  width: 'auto',
                  padding: '0.5rem 0.8rem',
                  fontSize: '0.8rem',
                  background: 'rgba(245, 158, 11, 0.1)',
                  color: 'var(--accent-gold)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                }}
              >
                📋 Historial ({historial.length})
              </button>
            </div>

            {/* Historial expandible */}
            {mostrarHistorial && (
              <div className="alertas-historial" style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>Alertas de Restock Enviadas</h4>
                {historial.length === 0 ? (
                  <p style={{ fontSize: '0.85rem' }}>Sin alertas.</p>
                ) : (
                  <div className="alertas-list">
                    {historial.slice(0, 8).map((a) => (
                      <div className="alerta-item" key={a.id}>
                        <span className={`alerta-tipo-badge ${a.tipo}`}>
                          {a.tipo === 'automatica' ? '⚡ Auto' : '👤 Manual'}
                        </span>
                        <span className="alerta-material">{a.material}</span>
                        <span className="alerta-info">→ {a.email}</span>
                        <span className="alerta-fecha">
                          {new Date(a.fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tarjetas de proveedores */}
            <div className="prov-cards-list">
              {proveedores.map((prov) => (
                <div className="prov-card" key={prov.id}>
                  <div className="prov-card-header">
                    <div>
                      <h3 className="prov-card-name">{prov.empresa}</h3>
                      <p className="prov-card-contact">{prov.contacto}</p>
                    </div>
                    <button
                      className="prov-btn-delete"
                      onClick={() => handleEliminar(prov.id, prov.empresa)}
                      title="Eliminar proveedor"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                    </button>
                  </div>

                  <div className="prov-card-details">
                    <div className="prov-detail-row">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      <span>{prov.email}</span>
                    </div>
                    <div className="prov-detail-row">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                      </svg>
                      <span>{prov.telefono}</span>
                    </div>
                    {prov.rfc && (
                      <div className="prov-detail-row">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="3" width="20" height="18" rx="2" />
                          <line x1="2" y1="9" x2="22" y2="9" />
                        </svg>
                        <span>RFC: {prov.rfc}</span>
                      </div>
                    )}
                  </div>

                  {/* Materiales badges */}
                  <div className="prov-card-materiales">
                    <span className="prov-mat-label">Materiales:</span>
                    <div className="prov-mat-badges">
                      {prov.materialesNombres.map((nombre, i) => (
                        <span className="prov-mat-badge" key={i}>{nombre}</span>
                      ))}
                    </div>
                  </div>

                  {/* Umbral y acciones */}
                  <div className="prov-card-footer">
                    <span className="prov-umbral-badge">
                      Alerta: ≤ {prov.umbralAlerta} m²
                    </span>
                    <button
                      className="prov-btn-restock"
                      onClick={() => {
                        if (prov.materiales.length > 0) {
                          handleEnviarAlerta(prov.id, prov.materiales[0]);
                        }
                      }}
                      title="Enviar email de restock"
                    >
                      📧 Solicitar Restock
                    </button>
                  </div>

                  {prov.notas && (
                    <p className="prov-card-notas">{prov.notas}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Proveedores;

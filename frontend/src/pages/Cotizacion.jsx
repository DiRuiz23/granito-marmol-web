import React, { useState } from 'react';
import {
  CATALOGO_MATERIALES,
  ACABADOS,
  GROSORES,
  calcularSubtotalItem,
  calcularTotales,
  generarCotizacion,
  formatMXN,
} from '../services/cotizacionService';

const itemVacio = { material: '', cantidad: '', acabado: 'Pulido', grosor: '2 cm' };

const Cotizacion = () => {
  const [cliente, setCliente] = useState({ nombre: '', email: '' });
  const [items, setItems] = useState([{ ...itemVacio }]);
  const [cotizacionGenerada, setCotizacionGenerada] = useState(null);
  const [errors, setErrors] = useState({});

  const handleClienteChange = (e) => {
    const { name, value } = e.target;
    setCliente({ ...cliente, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const agregarItem = () => {
    setItems([...items, { ...itemVacio }]);
  };

  const eliminarItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = {};
    if (!cliente.nombre.trim()) newErrors.nombre = 'Nombre del cliente requerido.';
    if (!cliente.email.trim()) newErrors.email = 'Email del cliente requerido.';

    const tieneItemValido = items.some((item) => item.material && item.cantidad && parseFloat(item.cantidad) > 0);
    if (!tieneItemValido) newErrors.items = 'Agregue al menos un material con cantidad.';

    return newErrors;
  };

  const handleGenerar = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const itemsValidos = items.filter((item) => item.material && item.cantidad && parseFloat(item.cantidad) > 0);
    const cot = generarCotizacion(itemsValidos, cliente);
    setCotizacionGenerada(cot);
  };

  const handleNueva = () => {
    setCotizacionGenerada(null);
    setCliente({ nombre: '', email: '' });
    setItems([{ ...itemVacio }]);
    setErrors({});
  };

  const totales = calcularTotales(
    items.filter((i) => i.material && i.cantidad)
  );

  // Agrupar materiales por tipo
  const materialesPorTipo = CATALOGO_MATERIALES.reduce((acc, mat) => {
    if (!acc[mat.tipo]) acc[mat.tipo] = [];
    acc[mat.tipo].push(mat);
    return acc;
  }, {});

  // Si ya se generó la cotización, mostrar vista previa
  if (cotizacionGenerada) {
    return (
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="glass-card cot-documento">
          <div className="cot-doc-header">
            <div>
              <h2 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-secondary)' }}>COTIZACIÓN</h2>
              <span className="cot-folio">{cotizacionGenerada.folio}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>Taller de Granito y Mármol</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {new Date(cotizacionGenerada.fecha).toLocaleDateString('es-MX', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="cot-doc-cliente">
            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Cliente
            </h4>
            <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary)' }}>{cotizacionGenerada.cliente.nombre}</p>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>{cotizacionGenerada.cliente.email}</p>
          </div>

          <table className="cot-items-table">
            <thead>
              <tr>
                <th>Material</th>
                <th>Acabado</th>
                <th>Grosor</th>
                <th>Cant.</th>
                <th style={{ textAlign: 'right' }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cotizacionGenerada.items.map((item, i) => (
                <tr key={i}>
                  <td>
                    <strong>{item.materialNombre}</strong>
                    <br />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{item.materialTipo}</span>
                  </td>
                  <td>{item.acabado || '—'}</td>
                  <td>{item.grosor || '—'}</td>
                  <td>{item.cantidad} m²</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>${formatMXN(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cot-totales">
            <div className="cot-total-row">
              <span>Subtotal</span>
              <span>${formatMXN(cotizacionGenerada.subtotal)}</span>
            </div>
            <div className="cot-total-row">
              <span>IVA ({cotizacionGenerada.ivaPorcentaje}%)</span>
              <span>${formatMXN(cotizacionGenerada.iva)}</span>
            </div>
            <div className="cot-total-row cot-total-final">
              <span>Total</span>
              <span>${formatMXN(cotizacionGenerada.total)} MXN</span>
            </div>
          </div>

          <div className="cot-doc-footer">
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textAlign: 'center', margin: 0 }}>
              Cotización válida por 15 días. Precios sujetos a disponibilidad de material.
            </p>
          </div>

          <button onClick={handleNueva} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
            Generar Nueva Cotización
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '950px' }}>
      <div className="crm-layout-grid">
        {/* Formulario */}
        <div className="glass-card">
          <div className="card-header">
            <h1>Generador de Cotizaciones</h1>
            <p>Cree cotizaciones detalladas con cálculo automático de precios e IVA.</p>
          </div>

          <form onSubmit={handleGenerar} noValidate>
            {/* Datos del cliente */}
            <div className="form-section-title">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Datos del Cliente</span>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="cot-nombre">Nombre del Cliente *</label>
                <input
                  type="text"
                  id="cot-nombre"
                  name="nombre"
                  className="form-control"
                  placeholder="Nombre completo"
                  value={cliente.nombre}
                  onChange={handleClienteChange}
                />
                {errors.nombre && <span className="field-error">{errors.nombre}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="cot-email">Email del Cliente *</label>
                <input
                  type="email"
                  id="cot-email"
                  name="email"
                  className="form-control"
                  placeholder="correo@ejemplo.com"
                  value={cliente.email}
                  onChange={handleClienteChange}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
            </div>

            {/* Items de cotización */}
            <div className="form-section-title" style={{ marginTop: '0.5rem' }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span>Materiales ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
            </div>

            {errors.items && (
              <div style={{ marginBottom: '1rem' }}>
                <span className="field-error">{errors.items}</span>
              </div>
            )}

            {items.map((item, index) => {
              const subtotal = calcularSubtotalItem(item.material, item.cantidad, item.acabado, item.grosor);
              return (
                <div className="cot-item-card" key={index}>
                  <div className="cot-item-header">
                    <span className="cot-item-number">#{index + 1}</span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        className="cot-item-remove"
                        onClick={() => eliminarItem(index)}
                        title="Eliminar item"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Material</label>
                      <select
                        className="form-control material-select"
                        value={item.material}
                        onChange={(e) => handleItemChange(index, 'material', e.target.value)}
                      >
                        <option value="">— Seleccione —</option>
                        {Object.entries(materialesPorTipo).map(([tipo, materiales]) => (
                          <optgroup key={tipo} label={`⬦ ${tipo}`}>
                            {materiales.map((mat) => (
                              <option key={mat.id} value={mat.id}>
                                {mat.nombre} — ${mat.precioRef.toLocaleString('es-MX')}/m²
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Cantidad (m²)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Ej. 5"
                        min="0.5"
                        step="0.5"
                        value={item.cantidad}
                        onChange={(e) => handleItemChange(index, 'cantidad', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Acabado</label>
                      <select
                        className="form-control"
                        value={item.acabado}
                        onChange={(e) => handleItemChange(index, 'acabado', e.target.value)}
                      >
                        {ACABADOS.map((a) => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Grosor</label>
                      <select
                        className="form-control"
                        value={item.grosor}
                        onChange={(e) => handleItemChange(index, 'grosor', e.target.value)}
                      >
                        {GROSORES.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {subtotal > 0 && (
                    <div className="cot-item-subtotal">
                      Subtotal: <strong>${formatMXN(subtotal)} MXN</strong>
                    </div>
                  )}
                </div>
              );
            })}

            <button
              type="button"
              className="btn cot-btn-agregar"
              onClick={agregarItem}
            >
              + Agregar Material
            </button>

            <button type="submit" className="btn btn-primary btn-glowing" style={{ marginTop: '1rem' }}>
              Generar Cotización
            </button>
          </form>
        </div>

        {/* Panel de totales en vivo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card cot-totales-panel">
            <h3>Resumen en Vivo</h3>
            <p style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>Los totales se actualizan conforme agrega items.</p>

            <div className="cot-live-totals">
              <div className="cot-live-row">
                <span>Subtotal</span>
                <span>${formatMXN(totales.subtotal)}</span>
              </div>
              <div className="cot-live-row">
                <span>IVA (16%)</span>
                <span>${formatMXN(totales.iva)}</span>
              </div>
              <div className="cot-live-row cot-live-total">
                <span>Total</span>
                <span>${formatMXN(totales.total)}</span>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: 'rgba(59, 130, 246, 0.06)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.12)' }}>
              <p style={{ fontSize: '0.78rem', margin: 0, textAlign: 'center' }}>
                Items válidos: <strong style={{ color: 'var(--primary)' }}>{items.filter((i) => i.material && i.cantidad).length}</strong> de {items.length}
              </p>
            </div>
          </div>

          {/* Info de precios adicionales */}
          <div className="glass-card">
            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>Costos Adicionales</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="cot-extra-row">
                <span>Acabado Mate</span>
                <span>+$150/m²</span>
              </div>
              <div className="cot-extra-row">
                <span>Acabado Apomazado</span>
                <span>+$200/m²</span>
              </div>
              <div className="cot-extra-row">
                <span>Acabado Flameado</span>
                <span>+$250/m²</span>
              </div>
              <div className="cot-extra-row">
                <span>Grosor 3 cm</span>
                <span>+$350/m²</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cotizacion;

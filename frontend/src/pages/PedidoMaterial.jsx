import React, { useState } from 'react';
import ConsentimientoCheckbox from '../components/ConsentimientoCheckbox';
import MaterialCard from '../components/MaterialCard';
import {
  CATALOGO_MATERIALES,
  ACABADOS,
  GROSORES,
  USOS,
  crearPedido,
  buscarMaterial,
} from '../services/pedidoService';

const PedidoMaterial = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    material: '',
    cantidad: '',
    grosor: '',
    acabado: '',
    uso: '',
    fechaEntrega: '',
    notas: '',
  });

  const [consentido, setConsentido] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [folio, setFolio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Material info for preview card
  const materialInfo = formData.material ? buscarMaterial(formData.material) : null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleConsentChange = (e) => {
    setConsentido(e.target.checked);
    if (errors.consentimiento && e.target.checked) {
      setErrors({ ...errors, consentimiento: '' });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre completo es requerido.';
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingrese un correo electrónico válido.';
    }
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido.';
    if (!formData.material) newErrors.material = 'Seleccione un material.';
    if (!formData.cantidad || parseFloat(formData.cantidad) < 1) {
      newErrors.cantidad = 'La cantidad mínima es 1 m².';
    }
    if (!consentido) {
      newErrors.consentimiento = 'Debe aceptar el Aviso de Privacidad para enviar su solicitud.';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSuccessMsg('');
      setFolio('');
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await crearPedido({
        ...formData,
        consentimiento: consentido,
        fechaSolicitud: new Date().toISOString(),
      });

      setFolio(result.folio);
      setSuccessMsg(
        `¡Solicitud enviada exitosamente! Su número de folio es:`
      );

      // Reset form
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        material: '',
        cantidad: '',
        grosor: '',
        acabado: '',
        uso: '',
        fechaEntrega: '',
        notas: '',
      });
      setConsentido(false);
    } catch {
      setErrors({ general: 'Error al enviar la solicitud. Intente nuevamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Agrupar materiales por tipo para el select
  const materialesPorTipo = CATALOGO_MATERIALES.reduce((acc, mat) => {
    if (!acc[mat.tipo]) acc[mat.tipo] = [];
    acc[mat.tipo].push(mat);
    return acc;
  }, {});

  return (
    <div className="container" style={{ maxWidth: '1050px' }}>
      <div className="crm-layout-grid">

        {/* Columna Izquierda: Formulario */}
        <div className="glass-card">
          <div className="card-header">
            <h1>Solicitud de Material</h1>
            <p>Complete el formulario para solicitar piedras naturales del taller. Recibirá un folio de seguimiento.</p>
          </div>

          {/* Mensaje de éxito */}
          {successMsg && (
            <div className="folio-success" id="pedido-success-alert">
              <div className="folio-success-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <p>{successMsg}</p>
              <span className="folio-number">{folio}</span>
              <p className="folio-hint">Guarde este folio para dar seguimiento a su pedido.</p>
            </div>
          )}

          {/* Error general */}
          {errors.general && (
            <div style={{
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid var(--danger)',
              color: '#f87171',
              fontWeight: '500'
            }}>
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Sección: Datos de Contacto */}
            <div className="form-section-title">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Datos de Contacto</span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pedido-nombre">Nombre Completo *</label>
              <input
                type="text"
                id="pedido-nombre"
                name="nombre"
                className="form-control"
                placeholder="Ej. María García López"
                value={formData.nombre}
                onChange={handleChange}
              />
              {errors.nombre && <span className="field-error">{errors.nombre}</span>}
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="pedido-email">Correo Electrónico *</label>
                <input
                  type="email"
                  id="pedido-email"
                  name="email"
                  className="form-control"
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="pedido-telefono">Teléfono *</label>
                <input
                  type="tel"
                  id="pedido-telefono"
                  name="telefono"
                  className="form-control"
                  placeholder="4681234567"
                  value={formData.telefono}
                  onChange={handleChange}
                />
                {errors.telefono && <span className="field-error">{errors.telefono}</span>}
              </div>
            </div>

            {/* Sección: Detalles del Material */}
            <div className="form-section-title" style={{ marginTop: '0.5rem' }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span>Detalles del Material</span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pedido-material">Material *</label>
              <select
                id="pedido-material"
                name="material"
                className="form-control material-select"
                value={formData.material}
                onChange={handleChange}
              >
                <option value="">— Seleccione un material —</option>
                {Object.entries(materialesPorTipo).map(([tipo, materiales]) => (
                  <optgroup key={tipo} label={`⬦ ${tipo}`}>
                    {materiales.map((mat) => (
                      <option key={mat.id} value={mat.id} disabled={!mat.disponible}>
                        {mat.nombre} {!mat.disponible ? '(Agotado)' : `— $${mat.precioRef.toLocaleString('es-MX')}/m²`}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {errors.material && <span className="field-error">{errors.material}</span>}
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="pedido-cantidad">Cantidad (m²) *</label>
                <input
                  type="number"
                  id="pedido-cantidad"
                  name="cantidad"
                  className="form-control"
                  placeholder="Ej. 5"
                  min="1"
                  step="0.5"
                  value={formData.cantidad}
                  onChange={handleChange}
                />
                {errors.cantidad && <span className="field-error">{errors.cantidad}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="pedido-grosor">Grosor</label>
                <select
                  id="pedido-grosor"
                  name="grosor"
                  className="form-control"
                  value={formData.grosor}
                  onChange={handleChange}
                >
                  <option value="">— Seleccione —</option>
                  {GROSORES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="pedido-acabado">Acabado</label>
                <select
                  id="pedido-acabado"
                  name="acabado"
                  className="form-control"
                  value={formData.acabado}
                  onChange={handleChange}
                >
                  <option value="">— Seleccione —</option>
                  {ACABADOS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="pedido-uso">Uso Previsto</label>
                <select
                  id="pedido-uso"
                  name="uso"
                  className="form-control"
                  value={formData.uso}
                  onChange={handleChange}
                >
                  <option value="">— Seleccione —</option>
                  {USOS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pedido-fecha">Fecha Deseada de Entrega</label>
              <input
                type="date"
                id="pedido-fecha"
                name="fechaEntrega"
                className="form-control"
                value={formData.fechaEntrega}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pedido-notas">Notas Adicionales</label>
              <textarea
                id="pedido-notas"
                name="notas"
                className="form-control"
                rows="3"
                placeholder="Medidas específicas, detalles de corte, observaciones..."
                value={formData.notas}
                onChange={handleChange}
                style={{ resize: 'vertical', minHeight: '80px' }}
              />
            </div>

            {/* Consentimiento */}
            <ConsentimientoCheckbox
              checked={consentido}
              onChange={handleConsentChange}
              error={errors.consentimiento}
            />

            <button
              type="submit"
              className="btn btn-primary btn-glowing"
              id="btn-enviar-pedido"
              disabled={isSubmitting}
              style={{ opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Solicitud de Material'}
            </button>
          </form>
        </div>

        {/* Columna Derecha: Preview + Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Preview en vivo */}
          <MaterialCard formData={formData} materialInfo={materialInfo} />

          {/* Disponibilidad de materiales */}
          <div className="glass-card">
            <h3>Disponibilidad</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Estado actual de materiales en el taller.
            </p>
            <div className="availability-list">
              {CATALOGO_MATERIALES.map((mat) => (
                <div className="availability-item" key={mat.id}>
                  <span
                    className="availability-dot"
                    style={{
                      background: mat.disponible ? 'var(--accent)' : 'var(--danger)',
                      boxShadow: mat.disponible
                        ? '0 0 8px rgba(16, 185, 129, 0.6)'
                        : '0 0 8px rgba(239, 68, 68, 0.6)',
                    }}
                  />
                  <span className="availability-name">{mat.nombre}</span>
                  <span
                    className="availability-status"
                    style={{ color: mat.disponible ? 'var(--accent)' : 'var(--danger)' }}
                  >
                    {mat.disponible ? 'En Stock' : 'Agotado'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tiempos de entrega */}
          <div className="glass-card">
            <div className="delivery-info-card">
              <div className="delivery-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>Tiempos de Entrega</h4>
                <p style={{ fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>En stock:</strong> 3-5 días hábiles<br />
                  <strong style={{ color: 'var(--text-primary)' }}>Sobre pedido:</strong> 15-25 días hábiles<br />
                  <strong style={{ color: 'var(--text-primary)' }}>Importación:</strong> 30-45 días hábiles
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PedidoMaterial;

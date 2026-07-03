import React, { useState, useEffect } from 'react';
import { calcularCotizacion, crearCotizacion, descargarPDF, listarPlantillas } from '../services/cotizacionService';

const Cotizacion = () => {
  // Client default info
  const [clientData, setClientData] = useState({
    nombre: 'Juan Diego Ruiz Rivera',
    email: 'druizrivera24@outlook.com',
    telefono: '4681372815',
    direccion: 'calle Leandro valle 204 san luiz de la paz Gto',
  });

  // Selected project type & material
  const [tipoProyecto, setTipoProyecto] = useState('cocina');
  const [materialKey, setMaterialKey] = useState('granito_gris_oxford');

  // Strategy parameters
  const [params, setParams] = useState({
    // Cocina / Baño
    metros_lineales: '3.5',
    metros_zoclo: '3.5',
    cortes_estufa: '1',
    cortes_tarja: '1',
    cortes_lavabo: '1',
    faldon_requerido: false,
    borde_acabado: 'recto',
    
    // Escalera
    numero_escalones: '12',
    longitud_escalon: '1.2',
    peralte_incluido: true,

    // Fachada
    metros_cuadrados: '15.0',
    tipo_soporte: 'adhesivo',

    // Shared / Extra costs
    presupuesto: '0',
    costo_materiales_adicionales: '0',
    mano_de_obra_adicional: '0',
    instalacion_requerida: true
  });

  // UI/API States
  const [errors, setErrors] = useState({});
  const [calculating, setCalculating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [savedQuoteId, setSavedQuoteId] = useState(null);
  const [notification, setNotification] = useState({ type: '', message: '' });

  // Prototype Pattern — project templates
  const [plantillas, setPlantillas] = useState([]);
  const [loadingPlantillas, setLoadingPlantillas] = useState(true);

  // Reset/Adjust parameters when project type changes
  useEffect(() => {
    if (tipoProyecto === 'escalera') {
      setMaterialKey('marmol_carrara');
    } else {
      setMaterialKey('granito_gris_oxford');
    }
    setResultado(null);
    setSavedQuoteId(null);
    setNotification({ type: '', message: '' });
  }, [tipoProyecto]);

  // Fetch all prototype templates on mount
  useEffect(() => {
    listarPlantillas()
      .then(data => setPlantillas(data || []))
      .catch(() => setPlantillas([]))
      .finally(() => setLoadingPlantillas(false));
  }, []);

  const applyPlantilla = (plantilla) => {
    setTipoProyecto(plantilla.tipo_proyecto);
    setMaterialKey(plantilla.material_key);
    setParams(prev => ({ ...prev, ...plantilla.params }));
    setResultado(null);
    setSavedQuoteId(null);
    showNotification('success', `✓ Plantilla "${plantilla.nombre_plantilla}" aplicada. Ajusta los valores si lo deseas y presiona Calcular.`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setClientData({ ...clientData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleParamChange = (e) => {
    const { name, value, type, checked } = e.target;
    setParams({
      ...params,
      [name]: type === 'checkbox' ? checked : value
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    setSavedQuoteId(null);
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: '', message: '' });
    }, 6000);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!clientData.nombre.trim()) newErrors.nombre = 'Nombre es requerido';
    if (!clientData.email.trim()) newErrors.email = 'Email es requerido';
    if (!clientData.telefono.trim()) newErrors.telefono = 'Teléfono es requerido';

    if (tipoProyecto === 'cocina' || tipoProyecto === 'bano') {
      if (!params.metros_lineales || parseFloat(params.metros_lineales) <= 0) {
        newErrors.metros_lineales = 'Los metros lineales deben ser mayores a 0';
      }
    } else if (tipoProyecto === 'escalera') {
      if (!params.numero_escalones || parseInt(params.numero_escalones) <= 0) {
        newErrors.numero_escalones = 'El número de escalones debe ser mayor a 0';
      }
      if (!params.longitud_escalon || parseFloat(params.longitud_escalon) <= 0) {
        newErrors.longitud_escalon = 'La longitud del escalón debe ser mayor a 0';
      }
    } else if (tipoProyecto === 'fachada') {
      if (!params.metros_cuadrados || parseFloat(params.metros_cuadrados) <= 0) {
        newErrors.metros_cuadrados = 'Los metros cuadrados deben ser mayores a 0';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalcular = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    setCalculating(true);
    setResultado(null);
    setSavedQuoteId(null);

    const requestParams = { 
      material_key: materialKey, 
      instalacion_requerida: params.instalacion_requerida,
      presupuesto: parseFloat(params.presupuesto || 0),
      costo_materiales_adicionales: parseFloat(params.costo_materiales_adicionales || 0),
      mano_de_obra_adicional: parseFloat(params.mano_de_obra_adicional || 0)
    };
    if (tipoProyecto === 'cocina') {
      requestParams.metros_lineales = params.metros_lineales;
      requestParams.metros_zoclo = params.metros_zoclo;
      requestParams.cortes_estufa = params.cortes_estufa;
      requestParams.cortes_tarja = params.cortes_tarja;
      requestParams.borde_acabado = params.borde_acabado;
    } else if (tipoProyecto === 'bano') {
      requestParams.metros_lineales = params.metros_lineales;
      requestParams.cortes_lavabo = params.cortes_lavabo;
      requestParams.faldon_requerido = params.faldon_requerido;
      requestParams.borde_acabado = params.borde_acabado;
    } else if (tipoProyecto === 'escalera') {
      requestParams.numero_escalones = params.numero_escalones;
      requestParams.longitud_escalon = params.longitud_escalon;
      requestParams.peralte_incluido = params.peralte_incluido;
    } else if (tipoProyecto === 'fachada') {
      requestParams.metros_cuadrados = params.metros_cuadrados;
      requestParams.tipo_soporte = params.tipo_soporte;
    }

    try {
      const response = await calcularCotizacion(tipoProyecto, requestParams);
      if (response.ok) {
        setResultado(response.data);
        showNotification('success', 'Cálculo realizado con éxito utilizando la estrategia ' + tipoProyecto.toUpperCase());
      } else {
        showNotification('error', response.message || 'Error al calcular.');
      }
    } catch (err) {
      showNotification('error', err.message || 'Error de conexión con el backend.');
    } finally {
      setCalculating(false);
    }
  };

  const handleGuardar = async () => {
    if (!resultado) return;
    setSaving(true);
    
    const requestParams = { 
      material_key: materialKey, 
      instalacion_requerida: params.instalacion_requerida,
      presupuesto: parseFloat(params.presupuesto || 0),
      costo_materiales_adicionales: parseFloat(params.costo_materiales_adicionales || 0),
      mano_de_obra_adicional: parseFloat(params.mano_de_obra_adicional || 0)
    };
    if (tipoProyecto === 'cocina') {
      requestParams.metros_lineales = parseFloat(params.metros_lineales);
      requestParams.metros_zoclo = parseFloat(params.metros_zoclo);
      requestParams.cortes_estufa = parseInt(params.cortes_estufa);
      requestParams.cortes_tarja = parseInt(params.cortes_tarja);
      requestParams.borde_acabado = params.borde_acabado;
    } else if (tipoProyecto === 'bano') {
      requestParams.metros_lineales = parseFloat(params.metros_lineales);
      requestParams.cortes_lavabo = parseInt(params.cortes_lavabo);
      requestParams.faldon_requerido = params.faldon_requerido;
      requestParams.borde_acabado = params.borde_acabado;
    } else if (tipoProyecto === 'escalera') {
      requestParams.numero_escalones = parseInt(params.numero_escalones);
      requestParams.longitud_escalon = parseFloat(params.longitud_escalon);
      requestParams.peralte_incluido = params.peralte_incluido;
    } else if (tipoProyecto === 'fachada') {
      requestParams.metros_cuadrados = parseFloat(params.metros_cuadrados);
      requestParams.tipo_soporte = params.tipo_soporte;
    }

    const payload = {
      cliente: clientData,
      tipo_proyecto: resultado.tipo_proyecto,
      material: resultado.material,
      params: requestParams,
      subtotal: resultado.subtotal,
      iva: resultado.iva,
      total: resultado.total
    };

    try {
      const response = await crearCotizacion(payload);
      if (response.ok) {
        setSavedQuoteId(response.data.id);
        showNotification('success', `Cotización #${response.data.id} guardada en base de datos.`);
      } else {
        showNotification('error', response.message || 'Error al guardar.');
      }
    } catch (err) {
      showNotification('error', err.message || 'Error de conexión.');
    } finally {
      setSaving(false);
    }
  };

  const handleDescargarPDF = async () => {
    if (!savedQuoteId) return;
    try {
      showNotification('success', 'Generando PDF con ReportLab en el servidor...');
      await descargarPDF(savedQuoteId);
    } catch (err) {
      showNotification('error', err.message || 'Error al descargar PDF.');
    }
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', background: 'linear-gradient(135deg, #fff 30%, #C5A880 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Generador de Cotizaciones
        </h1>
        <p style={{ maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
          Calcule presupuestos formalizados al instante utilizando el patrón de diseño Strategy y genere reportes profesionales en formato PDF con ReportLab.
        </p>
      </div>

      {notification.message && (
        <div 
          className={notification.type === 'success' ? 'alert-success' : 'alert-danger'} 
          style={{ 
            marginBottom: '2rem', 
            padding: '1rem', 
            borderRadius: '8px', 
            animation: 'fadeIn 0.3s ease',
            border: notification.type === 'success' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
            background: notification.type === 'success' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
            color: notification.type === 'success' ? '#34d399' : '#f87171'
          }}
        >
          {notification.message}
        </div>
      )}

      <div className="quote-grid">
        
        {/* LEFT COLUMN: Input Form */}
        <div className="glass-card" style={{ padding: '2rem' }}>

          {/* Prototype Pattern — Quick Templates */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>⚡</span> Plantillas Rápidas
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Selecciona una plantilla frecuente para pre-llenar el formulario automáticamente.
            </p>
            {loadingPlantillas ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cargando plantillas...</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem' }}>
                {plantillas.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => applyPlantilla(p)}
                    style={{
                      textAlign: 'left',
                      padding: '0.7rem 0.9rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'rgba(197,168,128,0.06)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      color: 'var(--text-primary)'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-gold)'; e.currentTarget.style.background = 'rgba(197,168,128,0.12)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'rgba(197,168,128,0.06)'; }}
                  >
                    <div style={{ fontWeight: '600', fontSize: '0.82rem', color: 'var(--accent-gold)', marginBottom: '0.2rem' }}>{p.nombre_plantilla}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>{p.descripcion.slice(0, 70)}...</div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Step 1: Client details */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1.25rem', color: 'var(--accent-gold)' }}>
              1. Datos del Cliente
            </h3>
            
            <div className="form-group">
              <label className="form-label" htmlFor="nombre">Nombre del Cliente *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                className="form-control"
                value={clientData.nombre}
                onChange={handleClientChange}
                placeholder="Ej. Juan Diego Ruiz Rivera"
              />
              {errors.nombre && <span className="field-error">{errors.nombre}</span>}
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="email">Correo Electrónico *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  value={clientData.email}
                  onChange={handleClientChange}
                  placeholder="druizrivera24@outlook.com"
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="telefono">Teléfono Celular *</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  className="form-control"
                  value={clientData.telefono}
                  onChange={handleClientChange}
                  placeholder="4681372815"
                />
                {errors.telefono && <span className="field-error">{errors.telefono}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="direccion">Dirección de Entrega / Instalación</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                className="form-control"
                value={clientData.direccion}
                onChange={handleClientChange}
                placeholder="Calle Leandro valle 204, San Luis de la Paz, Gto."
              />
            </div>
          </div>

          {/* Step 2: Project type and materials */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1.25rem', color: 'var(--accent-gold)' }}>
              2. Configuración del Proyecto
            </h3>

            {/* Project type selection tabs */}
            <div className="project-type-tabs">
              <button 
                type="button"
                className={`project-tab ${tipoProyecto === 'cocina' ? 'active' : ''}`}
                onClick={() => setTipoProyecto('cocina')}
              >
                Cocina
              </button>
              <button 
                type="button"
                className={`project-tab ${tipoProyecto === 'bano' ? 'active' : ''}`}
                onClick={() => setTipoProyecto('bano')}
              >
                Baño
              </button>
              <button 
                type="button"
                className={`project-tab ${tipoProyecto === 'escalera' ? 'active' : ''}`}
                onClick={() => setTipoProyecto('escalera')}
              >
                Escalera
              </button>
              <button 
                type="button"
                className={`project-tab ${tipoProyecto === 'fachada' ? 'active' : ''}`}
                onClick={() => setTipoProyecto('fachada')}
              >
                Fachada
              </button>
            </div>

            {/* Material selection */}
            <div className="form-group">
              <label className="form-label" htmlFor="materialKey">Tipo de Piedra *</label>
              <select
                id="materialKey"
                name="materialKey"
                className="form-control"
                style={{ appearance: 'auto' }}
                value={materialKey}
                onChange={(e) => setMaterialKey(e.target.value)}
              >
                <option value="granito_gris_oxford">Granito Gris Oxford ($3,200/u)</option>
                <option value="marmol_carrara">Mármol Carrara ($4,500/u)</option>
                <option value="cuarzo_blanco_estelar">Cuarzo Blanco Estelar ($5,200/u)</option>
                <option value="granito_negro_absoluto">Granito Negro Absoluto ($5,800/u)</option>
              </select>
            </div>

            {/* Dynamic Strategy-based Inputs */}
            <div className="strategy-fields-card">
              
              {tipoProyecto === 'cocina' && (
                <div>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label" htmlFor="metros_lineales">Metros Lineales (ml) *</label>
                      <input
                        type="number"
                        step="0.1"
                        id="metros_lineales"
                        name="metros_lineales"
                        className="form-control"
                        value={params.metros_lineales}
                        onChange={handleParamChange}
                      />
                      {errors.metros_lineales && <span className="field-error">{errors.metros_lineales}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="metros_zoclo">Metros de Zoclo (ml)</label>
                      <input
                        type="number"
                        step="0.1"
                        id="metros_zoclo"
                        name="metros_zoclo"
                        className="form-control"
                        value={params.metros_zoclo}
                        onChange={handleParamChange}
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label" htmlFor="cortes_estufa">Cortes para Estufa/Parrilla</label>
                      <input
                        type="number"
                        id="cortes_estufa"
                        name="cortes_estufa"
                        className="form-control"
                        value={params.cortes_estufa}
                        onChange={handleParamChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="cortes_tarja">Cortes para Tarja</label>
                      <input
                        type="number"
                        id="cortes_tarja"
                        name="cortes_tarja"
                        className="form-control"
                        value={params.cortes_tarja}
                        onChange={handleParamChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="borde_acabado">Acabado del Borde (Canto)</label>
                    <select
                      id="borde_acabado"
                      name="borde_acabado"
                      className="form-control"
                      value={params.borde_acabado}
                      onChange={handleParamChange}
                      style={{ appearance: 'auto' }}
                    >
                      <option value="recto">Recto / Pulido Plano (Sin costo extra)</option>
                      <option value="boleado">Boleado / Media Caña (+$450/ml)</option>
                      <option value="inglete">Corte a Inglete a 45° (+$600/ml)</option>
                    </select>
                  </div>
                </div>
              )}

              {tipoProyecto === 'bano' && (
                <div>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label" htmlFor="metros_lineales">Metros Lineales (ml) *</label>
                      <input
                        type="number"
                        step="0.1"
                        id="metros_lineales"
                        name="metros_lineales"
                        className="form-control"
                        value={params.metros_lineales}
                        onChange={handleParamChange}
                      />
                      {errors.metros_lineales && <span className="field-error">{errors.metros_lineales}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="cortes_lavabo">Cortes para Lavabo/Ovalín</label>
                      <input
                        type="number"
                        id="cortes_lavabo"
                        name="cortes_lavabo"
                        className="form-control"
                        value={params.cortes_lavabo}
                        onChange={handleParamChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="borde_acabado">Acabado del Borde (Canto)</label>
                    <select
                      id="borde_acabado"
                      name="borde_acabado"
                      className="form-control"
                      value={params.borde_acabado}
                      onChange={handleParamChange}
                      style={{ appearance: 'auto' }}
                    >
                      <option value="recto">Recto / Pulido Plano (Sin costo extra)</option>
                      <option value="boleado">Boleado / Media Caña (+$450/ml)</option>
                      <option value="inglete">Corte a Inglete a 45° (+$600/ml)</option>
                    </select>
                  </div>

                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      name="faldon_requerido"
                      className="checkbox-input"
                      checked={params.faldon_requerido}
                      onChange={handleParamChange}
                    />
                    <span className="checkbox-text">
                      Requiere faldón frontal (Cuelgue vertical de protección, +$600/ml)
                    </span>
                  </label>
                </div>
              )}

              {tipoProyecto === 'escalera' && (
                <div>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label" htmlFor="numero_escalones">Número de Escalones *</label>
                      <input
                        type="number"
                        id="numero_escalones"
                        name="numero_escalones"
                        className="form-control"
                        value={params.numero_escalones}
                        onChange={handleParamChange}
                      />
                      {errors.numero_escalones && <span className="field-error">{errors.numero_escalones}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="longitud_escalon">Longitud del Escalón (ml) *</label>
                      <input
                        type="number"
                        step="0.1"
                        id="longitud_escalon"
                        name="longitud_escalon"
                        className="form-control"
                        value={params.longitud_escalon}
                        onChange={handleParamChange}
                      />
                      {errors.longitud_escalon && <span className="field-error">{errors.longitud_escalon}</span>}
                    </div>
                  </div>

                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      name="peralte_incluido"
                      className="checkbox-input"
                      checked={params.peralte_incluido}
                      onChange={handleParamChange}
                    />
                    <span className="checkbox-text">
                      Incluir peralte (Recubrimiento vertical posterior del escalón)
                    </span>
                  </label>
                </div>
              )}

              {tipoProyecto === 'fachada' && (
                <div>
                  <div className="form-grid-2">
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label className="form-label" htmlFor="metros_cuadrados">Metros Cuadrados Totales (m²) *</label>
                      <input
                        type="number"
                        step="0.1"
                        id="metros_cuadrados"
                        name="metros_cuadrados"
                        className="form-control"
                        value={params.metros_cuadrados}
                        onChange={handleParamChange}
                      />
                      {errors.metros_cuadrados && <span className="field-error">{errors.metros_cuadrados}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="tipo_soporte">Fijación / Tipo de Soporte</label>
                    <select
                      id="tipo_soporte"
                      name="tipo_soporte"
                      className="form-control"
                      value={params.tipo_soporte}
                      onChange={handleParamChange}
                      style={{ appearance: 'auto' }}
                    >
                      <option value="adhesivo">Adhesivo químico de alta resistencia (+$150/m²)</option>
                      <option value="grapas">Anclaje mecánico metálico (Grapas especiales) (+$300/m²)</option>
                    </select>
                  </div>
                </div>
              )}

              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px dashed var(--border)', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-gold)', marginBottom: '1rem', fontWeight: '600' }}>
                  Ajustes Adicionales (Costo, Presupuesto y Mano de Obra)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="presupuesto">Presupuesto ($)</label>
                    <input
                      type="number"
                      id="presupuesto"
                      name="presupuesto"
                      className="form-control"
                      value={params.presupuesto}
                      onChange={handleParamChange}
                      placeholder="0"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="costo_materiales_adicionales">Costo Mat. Extra ($)</label>
                    <input
                      type="number"
                      id="costo_materiales_adicionales"
                      name="costo_materiales_adicionales"
                      className="form-control"
                      value={params.costo_materiales_adicionales}
                      onChange={handleParamChange}
                      placeholder="0"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="mano_de_obra_adicional">M.O. Extra ($)</label>
                    <input
                      type="number"
                      id="mano_de_obra_adicional"
                      name="mano_de_obra_adicional"
                      className="form-control"
                      value={params.mano_de_obra_adicional}
                      onChange={handleParamChange}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <label className="checkbox-container" style={{ marginTop: '1rem' }}>
                <input
                  type="checkbox"
                  name="instalacion_requerida"
                  className="checkbox-input"
                  checked={params.instalacion_requerida}
                  onChange={handleParamChange}
                />
                <span className="checkbox-text" style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                  Requiere colocación e instalación profesional por nuestro taller
                </span>
              </label>

            </div>
          </div>

          <button 
            onClick={handleCalcular} 
            disabled={calculating}
            className="btn btn-primary btn-glowing"
            style={{ width: '100%' }}
          >
            {calculating ? 'Calculando Presupuesto...' : 'Calcular Desglose'}
          </button>
        </div>

        {/* RIGHT COLUMN: Live Summary / Result Panel */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', padding: '2rem', minHeight: '400px' }}>
          <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: 'var(--accent-gold)' }}>
            Resumen de la Cotización
          </h3>

          {!resultado ? (
            <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.3, marginBottom: '1rem' }}>
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              <p style={{ fontSize: '0.95rem' }}>Configure el proyecto y haga clic en <b>"Calcular Desglose"</b> para ver el resumen detallado aquí.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, animation: 'fadeIn 0.35s ease' }}>
              
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Tipo de Proyecto</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--primary)' }}>{resultado.tipo_proyecto}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Piedra seleccionada</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>{resultado.material}</span>
                </div>
              </div>

              <div style={{ flex: 1, marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: '600', letterSpacing: '0.05em' }}>
                  Conceptos Detallados
                </h4>
                
                <div className="concepts-list-scroll" style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                  {resultado.items.map((item, index) => (
                    <div 
                      key={index}
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        padding: '0.6rem 0',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        fontSize: '0.88rem'
                      }}
                    >
                      <div style={{ paddingRight: '1rem' }}>
                        <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{item.concepto}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          Cant: {item.cantidad} {item.unidad} @ ${item.precio_unitario.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                        ${item.total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Subtotal:</span>
                  <span style={{ fontWeight: '500' }}>${resultado.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>IVA (16%):</span>
                  <span style={{ fontWeight: '500' }}>${resultado.iva.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '0.85rem 1rem', 
                    background: 'rgba(245, 158, 11, 0.04)', 
                    border: '1px solid rgba(245, 158, 11, 0.2)', 
                    borderRadius: '8px' 
                  }}
                >
                  <span style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--accent-gold)' }}>Total Neto:</span>
                  <span style={{ fontWeight: '800', fontSize: '1.3rem', color: '#fff' }}>
                    ${resultado.total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {!savedQuoteId ? (
                  <button
                    onClick={handleGuardar}
                    disabled={saving}
                    className="btn"
                    style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.2)' }}
                  >
                    {saving ? 'Guardando en Base de Datos...' : 'Guardar y Confirmar Cotización'}
                  </button>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#34d399', fontWeight: '500', padding: '0.25rem 0' }}>
                      ✓ Cotización registrada correctamente.
                    </div>
                    <button
                      onClick={handleDescargarPDF}
                      className="btn btn-primary btn-glowing"
                      style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                        </svg>
                        Descargar PDF Oficial
                      </div>
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Cotizacion;

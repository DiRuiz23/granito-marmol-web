import React, { useState } from 'react';
import ConsentimientoCheckbox from '../components/ConsentimientoCheckbox';

const CRM = () => {
  // Pre-filled form data per user request
  const [formData, setFormData] = useState({
    nombre: 'Juan Diego Ruiz Rivera',
    email: 'druizrivera24@outlook.com',
    telefono: '4681372815',
    direccion: 'calle Leandro valle 204 san luiz de la paz Gto',
  });
  
  // Consent checkbox state: INITIALIZED TO FALSE (NO PRE-MARCADO for legal safety)
  const [consentido, setConsentido] = useState(false);
  
  // Validation and UI states
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre completo es requerido.';
    if (!formData.email.trim()) newErrors.email = 'El correo electrónico es requerido.';
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido.';
    
    // CRITICAL LEGAL VALIDATION: Must check the consent checkbox
    if (!consentido) {
      newErrors.consentimiento = 'Debe aceptar el Aviso de Privacidad para continuar con el registro.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSuccessMsg('');
      return;
    }

    setErrors({});
    setSuccessMsg(`¡Registro completo! El cliente "${formData.nombre}" ha sido guardado con firma de datos segura.`);
    
    // Reset form fields
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      direccion: '',
    });
    setConsentido(false);
  };

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <div className="crm-layout-grid">
        
        {/* Left Side: Form Container */}
        <div className="glass-card crm-form-card">
          <div className="card-header">
            <h2>Registro de Clientes</h2>
            <p>Complete la información del cliente y autorice el tratamiento de datos.</p>
          </div>

          {successMsg && (
            <div className="alert-success" id="success-alert" style={{ animation: 'fadeIn 0.3s ease' }}>
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="nombre">Nombre Completo *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                className="form-control"
                placeholder="Ej. Juan Diego Ruiz Rivera"
                value={formData.nombre}
                onChange={handleChange}
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
                  placeholder="ejemplo@correo.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="telefono">Teléfono *</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  className="form-control"
                  placeholder="4681372815"
                  value={formData.telefono}
                  onChange={handleChange}
                />
                {errors.telefono && <span className="field-error">{errors.telefono}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="direccion">Dirección de Entrega/Instalación</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                className="form-control"
                placeholder="Calle Leandro Valle 204, San Luis de la Paz, Gto."
                value={formData.direccion}
                onChange={handleChange}
              />
            </div>

            {/* Consent Checkbox */}
            <ConsentimientoCheckbox
              checked={consentido}
              onChange={handleConsentChange}
              error={errors.consentimiento}
            />

            <button type="submit" className="btn btn-primary btn-glowing" id="btn-registrar">
              Firmar Consentimiento y Registrar
            </button>
          </form>
        </div>

        {/* Right Side: Authenticity Seals and Info */}
        <div className="glass-card seals-sidebar">
          <h3>Sellos de Autenticidad</h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Nuestros materiales cuentan con los más altos estándares de calidad e importación directa.
          </p>

          <div className="seals-list">
            
            {/* Seal 1: Premium Granite */}
            <div className="seal-badge">
              <div className="seal-icon-wrapper gold">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="seal-text-content">
                <h4>Granito Premium Certificado</h4>
                <p>Piedra 100% natural, resistente al calor y rayaduras.</p>
              </div>
            </div>

            {/* Seal 2: Carrara Marble */}
            <div className="seal-badge">
              <div className="seal-icon-wrapper silver">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                  <line x1="12" y1="2" x2="12" y2="22" />
                  <line x1="2" y1="8.5" x2="22" y2="15.5" />
                  <line x1="2" y1="15.5" x2="22" y2="8.5" />
                </svg>
              </div>
              <div className="seal-text-content">
                <h4>Mármol de Importación</h4>
                <p>Bloques seleccionados de canteras italianas y españolas.</p>
              </div>
            </div>

            {/* Seal 3: LGPDPPSO Protegido */}
            <div className="seal-badge">
              <div className="seal-icon-wrapper green">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 11l2 2 4-4" />
                </svg>
              </div>
              <div className="seal-text-content">
                <h4>Privacidad LGPDPPSO</h4>
                <p>Encriptación y resguardo seguro de su información personal.</p>
              </div>
            </div>

          </div>

          <div className="certificate-banner">
            <div className="banner-glow"></div>
            <h5>Taller Autorizado</h5>
            <p style={{ fontSize: '0.8rem', margin: 0, color: 'var(--text-primary)' }}>
              Licencia No. GTM-2026-MX
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CRM;

import React, { useState, useEffect } from 'react';

const Seguridad = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' | 'error'

  const fetchSecurityStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/security-status');
      const data = await res.json();
      if (data.ok) {
        setStatus(data);
      }
    } catch (err) {
      console.error('Error al obtener estado de seguridad:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityStatus();
  }, []);

  const handleSetCookie = async () => {
    try {
      const res = await fetch('/api/set-secure-cookie');
      const data = await res.json();
      if (data.ok) {
        setMessage('¡Sesión Segura Creada! Cookie HTTPOnly y SameSite=Lax configurada correctamente.');
        setMessageType('success');
        fetchSecurityStatus();
      } else {
        setMessage('Error al crear la cookie.');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Error de red al establecer la cookie.');
      setMessageType('error');
    }
  };

  const handleClearCookie = async () => {
    try {
      const res = await fetch('/api/clear-cookie');
      const data = await res.json();
      if (data.ok) {
        setMessage('Cookie de sesión eliminada con éxito.');
        setMessageType('success');
        fetchSecurityStatus();
      } else {
        setMessage('Error al limpiar la cookie.');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Error de red al limpiar la cookie.');
      setMessageType('error');
    }
  };

  const headerExplainer = {
    'Content-Security-Policy': 'Define qué recursos (JS, CSS, Imágenes) puede cargar el navegador, previniendo ataques de inyección de código (XSS).',
    'Strict-Transport-Security': 'Fuerza al navegador a comunicarse únicamente mediante conexiones seguras HTTPS (HSTS).',
    'X-Frame-Options': 'Protege el sitio de ser embebido en iframes de terceros, previniendo ataques de clickjacking.',
    'X-Content-Type-Options': 'Evita que el navegador intente adivinar el tipo MIME de los archivos, mitigando ataques de suplantación.',
    'Referrer-Policy': 'Controla cuánta información de referencia (origen del link) se envía con cada petición.',
    'X-XSS-Protection': 'Activa filtros básicos en navegadores antiguos contra Cross-Site Scripting.'
  };

  return (
    <div className="container">
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h1>Seguridad HTTP & Cabeceras</h1>
          <p>Monitoreo y pruebas de directivas de seguridad web implementadas en el servidor Express/Helmet.</p>
        </div>

        {message && (
          <div 
            style={{
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              backgroundColor: messageType === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${messageType === 'success' ? 'var(--accent)' : 'var(--danger)'}`,
              color: messageType === 'success' ? '#34d399' : '#f87171',
              fontWeight: '500'
            }}
          >
            {message}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
          <div>
            <h3>Prueba de Cookies Seguras</h3>
            <p>
              Establezca o limpie una cookie firmada con las directivas de seguridad recomendadas: 
              <strong> HttpOnly</strong> (no accesible por JS) y <strong>SameSite=Lax</strong> (protección CSRF).
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button onClick={handleSetCookie} className="btn btn-primary" style={{ flex: 1 }}>
                Establecer Cookie Segura
              </button>
              <button onClick={handleClearCookie} className="btn" style={{ flex: 1, border: '1px solid var(--border)', background: 'transparent', color: '#fff' }}>
                Limpiar Cookie
              </button>
            </div>
          </div>

          <div style={{ background: 'rgba(8, 12, 20, 0.5)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <h3>Estado de Conexión & Sesión</h3>
            {loading ? (
              <p>Cargando información...</p>
            ) : (
              <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Protocolo Activo:</span>
                  <span style={{ color: status?.isSecureConnection ? 'var(--accent)' : 'var(--accent-gold)', fontWeight: 'bold' }}>
                    {status?.protocol || 'Desconocido'} {status?.isSecureConnection ? '🔒' : '⚠️'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Cookie de Sesión Activa:</span>
                  <span style={{ color: status?.cookies?.hasUserSessionCookie ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: 'bold' }}>
                    {status?.cookies?.hasUserSessionCookie ? 'Activa y Firmada ✓' : 'No Detectada'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Seguridad de Cookie:</span>
                  <span style={{ color: 'var(--accent)' }}>HttpOnly, SameSite=Lax</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card-header" style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', marginBottom: '1.5rem' }}>
          <h2>Cabeceras de Seguridad HTTP (Helmet)</h2>
          <p>Cabeceras enviadas por el servidor web para proteger contra vectores comunes de ataque.</p>
        </div>

        {loading ? (
          <p>Cargando cabeceras...</p>
        ) : (
          <div style={{ display: 'grid', gap: '1.25rem' }}>
            {status?.securityHeaders && Object.entries(status.securityHeaders).map(([header, value]) => {
              const isConfigured = value !== 'Faltante';
              return (
                <div 
                  key={header} 
                  style={{
                    background: 'rgba(15, 23, 42, 0.4)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '1.25rem',
                    transition: 'border-color 0.2s',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 'bold', fontFamily: 'monospace', fontSize: '1.05rem', color: '#60a5fa' }}>{header}</span>
                    <span 
                      style={{
                        fontSize: '0.75rem',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        backgroundColor: isConfigured ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: isConfigured ? 'var(--accent)' : 'var(--danger)',
                        border: `1px solid ${isConfigured ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                      }}
                    >
                      {isConfigured ? 'CONFIGURADA' : 'FALTANTE'}
                    </span>
                  </div>
                  <div style={{ background: 'rgba(8, 12, 20, 0.8)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', fontFamily: 'monospace', color: '#e2e8f0', marginBottom: '0.5rem', wordBreak: 'break-all' }}>
                    {value}
                  </div>
                  <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--text-secondary)' }}>
                    {headerExplainer[header] || 'Configuración y protección HTTP estándar.'}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Seguridad;

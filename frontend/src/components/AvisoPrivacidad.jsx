import React, { useState } from 'react';

const AvisoPrivacidad = () => {
  const [openSections, setOpenSections] = useState({
    1: true,
    2: true,
    3: false,
    4: false,
    5: false,
  });

  const toggleSection = (id) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="container privacy-container">
      {/* Decorative background glow */}
      <div className="privacy-glow"></div>

      <div className="glass-card privacy-card">
        {/* Header Section */}
        <div className="privacy-header">
          <div className="security-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>LGPDPPSO Cumplido</span>
          </div>
          <h1>Aviso de Privacidad Integral</h1>
          <p className="privacy-meta">
            Última actualización: 25 de junio de 2026 • Documento Oficial
          </p>
          <div className="header-divider"></div>
        </div>

        {/* Accordion / Interactive Sections */}
        <div className="privacy-accordion">
          
          {/* Section 1 */}
          <div className={`accordion-item ${openSections[1] ? 'is-open' : ''}`}>
            <button className="accordion-trigger" onClick={() => toggleSection(1)}>
              <div className="accordion-title-area">
                <div className="section-icon-wrapper shield-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="m9 11 2 2 4-4"/>
                  </svg>
                </div>
                <h3>1. Identidad y Domicilio del Responsable</h3>
              </div>
              <span className="chevron-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
            </button>
            <div className="accordion-content">
              <div className="accordion-content-inner">
                <p>
                  <strong>Juan Diego Ruiz Rivera</strong> (en adelante, "El Responsable"), con domicilio en <strong>calle Leandro valle 204, san luiz de la paz Gto</strong>, es responsable del tratamiento de sus datos personales, de conformidad con lo establecido en la Ley General de Protección de Datos Personales en Posesión de Sujetos Obligados (LGPDPPSO) y demás normatividad aplicable.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className={`accordion-item ${openSections[2] ? 'is-open' : ''}`}>
            <button className="accordion-trigger" onClick={() => toggleSection(2)}>
              <div className="accordion-title-area">
                <div className="section-icon-wrapper user-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                </div>
                <h3>2. Datos Personales que se Recaban</h3>
              </div>
              <span className="chevron-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
            </button>
            <div className="accordion-content">
              <div className="accordion-content-inner">
                <p>Para llevar a cabo las finalidades descritas en el presente aviso, recabaremos las siguientes categorías de datos personales:</p>
                <ul className="styled-list">
                  <li>
                    <span className="list-bullet"></span>
                    <div>
                      <strong>Datos de identificación:</strong> Juan Diego Ruiz Rivera.
                    </div>
                  </li>
                  <li>
                    <span className="list-bullet"></span>
                    <div>
                      <strong>Datos de contacto:</strong> druizrivera24@outlook.com, 4681372815.
                    </div>
                  </li>
                  <li>
                    <span className="list-bullet"></span>
                    <div>
                      <strong>Datos de ubicación:</strong> Calle Leandro Valle 204, San Luis de la Paz, Gto.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className={`accordion-item ${openSections[3] ? 'is-open' : ''}`}>
            <button className="accordion-trigger" onClick={() => toggleSection(3)}>
              <div className="accordion-title-area">
                <div className="section-icon-wrapper target-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="12" r="6"/>
                    <circle cx="12" cy="12" r="2"/>
                  </svg>
                </div>
                <h3>3. Finalidades del Tratamiento de los Datos</h3>
              </div>
              <span className="chevron-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
            </button>
            <div className="accordion-content">
              <div className="accordion-content-inner">
                <p>Los datos personales que recabamos de usted serán utilizados para las siguientes finalidades primarias y necesarias:</p>
                <ul className="styled-list">
                  <li>
                    <span className="list-bullet"></span>
                    <div>Procesar su registro como cliente en nuestro sistema de manera confidencial.</div>
                  </li>
                  <li>
                    <span className="list-bullet"></span>
                    <div>Elaboración de presupuestos personalizados y cotizaciones de trabajos en mármol, granito o cuarzo.</div>
                  </li>
                  <li>
                    <span className="list-bullet"></span>
                    <div>Agendar citas técnicas de medición y posterior instalación en obra.</div>
                  </li>
                  <li>
                    <span className="list-bullet"></span>
                    <div>Seguimiento al proyecto, satisfacción del cliente y contacto post-venta.</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className={`accordion-item ${openSections[4] ? 'is-open' : ''}`}>
            <button className="accordion-trigger" onClick={() => toggleSection(4)}>
              <div className="accordion-title-area">
                <div className="section-icon-wrapper key-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                  </svg>
                </div>
                <h3>4. Consentimiento Expreso (LGPDPPSO)</h3>
              </div>
              <span className="chevron-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
            </button>
            <div className="accordion-content">
              <div className="accordion-content-inner">
                <p>
                  De acuerdo con la legislación vigente, el tratamiento de sus datos requiere de su consentimiento expreso. Dicho consentimiento se otorga mediante la activación voluntaria del selector de consentimiento en nuestros formularios de registro. 
                </p>
                <div className="privacy-highlight-box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" style={{ marginRight: '0.75rem', flexShrink: 0 }}>
                    <circle cx="12" cy="12" r="10"/>
                    <path d="m9 12 2 2 4-4"/>
                  </svg>
                  <span>
                    <strong>Garantía de libertad:</strong> El selector de consentimiento por defecto no se encuentra pre-marcado, asegurando que su aceptación sea una acción libre, informada, específica y consciente.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5 */}
          <div className={`accordion-item ${openSections[5] ? 'is-open' : ''}`}>
            <button className="accordion-trigger" onClick={() => toggleSection(5)}>
              <div className="accordion-title-area">
                <div className="section-icon-wrapper mail-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <h3>5. Medios para Ejercer los Derechos ARCO</h3>
              </div>
              <span className="chevron-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
            </button>
            <div className="accordion-content">
              <div className="accordion-content-inner">
                <p>
                  Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos y las condiciones del uso que les damos (Acceso). Asimismo, es su derecho solicitar la corrección de su información personal en caso de que esté desactualizada, sea inexacta o incompleta (Rectificación); que la eliminemos de nuestros registros o bases de datos cuando considere que la misma no está siendo utilizada adecuadamente (Cancelación); así como oponerse al uso de sus datos personales para fines específicos (Oposición). Estos derechos se conocen como derechos ARCO.
                </p>
                <div className="arco-contact-card">
                  <h4>Contacto Oficial de Derechos ARCO</h4>
                  <p>Para ejercer cualquiera de sus derechos, envíe su solicitud formal a:</p>
                  <div className="arco-methods">
                    <div className="arco-method-item">
                      <div className="arco-method-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                      </div>
                      <a href="mailto:druizrivera24@outlook.com">druizrivera24@outlook.com</a>
                    </div>
                    <div className="arco-method-item">
                      <div className="arco-method-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                      </div>
                      <a href="tel:4681372815">4681372815</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer actions inside the card */}
        <div className="privacy-card-footer">
          <p className="footer-disclaimer">
            Este aviso cumple rigurosamente con la normatividad federal de protección de datos en posesión de particulares en los Estados Unidos Mexicanos.
          </p>
        </div>

      </div>
    </div>
  );
};

export default AvisoPrivacidad;

import React from 'react';

const AvisoPrivacidad = () => {
  return (
    <div className="container privacy-container glass-card">
      <h1 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Aviso de Privacidad Integral</h1>
      <p style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem', fontStyle: 'italic' }}>
        Última actualización: 25 de junio de 2026
      </p>

      <div className="privacy-section">
        <h3>1. Identidad y Domicilio del Responsable</h3>
        <p>
          <strong>Juan Diego Ruiz Rivera</strong> (en adelante, "El Responsable"), con domicilio en <strong>calle Leandro valle 204, san luiz de la paz Gto</strong>, es responsable del tratamiento de sus datos personales, de conformidad con lo establecido en la Ley General de Protección de Datos Personales en Posesión de Sujetos Obligados (LGPDPPSO) y demás normatividad aplicable.
        </p>
      </div>

      <div className="privacy-section">
        <h3>2. Datos Personales que se Recaban</h3>
        <p>Para llevar a cabo las finalidades descritas en el presente aviso, recabaremos las siguientes categorías de datos personales:</p>
        <ul>
          <li>Datos de identificación Juan Diego Ruiz Rivera.</li>
          <li>Datos de contacto druizrivera24@outlook.com, 4681372815.</li>
          <li>Datos de ubicación Calle Leandro Valle 204, San Luis de la Paz, Gto..</li>
        </ul>
      </div>

      <div className="privacy-section">
        <h3>3. Finalidades del Tratamiento de los Datos</h3>
        <p>Los datos personales que recabamos de usted serán utilizados para las siguientes finalidades primarias y necesarias:</p>
        <ul>
          <li>Procesar su registro como cliente en nuestro sistema.</li>
          <li>Elaboración de presupuestos y cotizaciones de trabajos en mármol, granito o cuarzo.</li>
          <li>Agendar citas técnicas de medición y posterior instalación en obra.</li>
          <li>Seguimiento y contacto post-venta.</li>
        </ul>
      </div>

      <div className="privacy-section">
        <h3>4. Consentimiento Expreso (LGPDPPSO)</h3>
        <p>
          De acuerdo con la legislación vigente, el tratamiento de sus datos requiere de su consentimiento expreso. Dicho consentimiento se otorga mediante la activación voluntaria del selector de consentimiento en nuestros formularios de registro.
          <strong> El selector por defecto no se encuentra pre-marcado, garantizando que su aceptación sea una acción libre, informada y consciente.</strong>
        </p>
      </div>

      <div className="privacy-section">
        <h3>5. Medios para Ejercer los Derechos ARCO</h3>
        <p>
          Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos y las condiciones del uso que les damos (Acceso). Asimismo, es su derecho solicitar la corrección de su información personal en caso de que esté desactualizada, sea inexacta o incompleta (Rectificación); que la eliminemos de nuestros registros o bases de datos cuando considere que la misma no está siendo utilizada adecuadamente (Cancelación); así como oponerse al uso de sus datos personales para fines específicos (Oposición). Estos derechos se conocen como derechos ARCO.
        </p>
        <p>
          Para el ejercicio de cualquiera de los derechos ARCO, usted deberá presentar la solicitud respectiva a través de un correo electrónico dirigido a: <strong>druizrivera24@outlook.com</strong> o comunicándose al teléfono <strong>4681372815</strong>.
        </p>
      </div>
    </div>
  );
};

export default AvisoPrivacidad;

import React from 'react';
import { Link } from 'react-router-dom';

const ConsentimientoCheckbox = ({ checked, onChange, error }) => {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label className="checkbox-container">
        <input
          type="checkbox"
          id="consentimiento-checkbox"
          className="checkbox-input"
          checked={checked}
          onChange={onChange}
        />
        <span className="checkbox-text">
          Acepto y doy mi consentimiento para el tratamiento de mis datos personales de acuerdo con el{' '}
          <Link to="/aviso-privacidad" target="_blank" rel="noopener noreferrer">
            Aviso de Privacidad Integral
          </Link>{' '}
          de este sitio.
        </span>
      </label>
      {error && <span className="checkbox-error" id="consentimiento-error">{error}</span>}
    </div>
  );
};

export default ConsentimientoCheckbox;

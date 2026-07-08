import React from 'react';

/**
 * MaterialCard — Componente de preview en vivo del pedido.
 * Muestra un resumen visual del material seleccionado y las opciones elegidas.
 */
const MaterialCard = ({ formData, materialInfo }) => {
  const hasData = formData.material || formData.cantidad || formData.acabado;

  // Colores por tipo de material
  const tipoColor = {
    Granito: { bg: 'rgba(148, 163, 184, 0.12)', color: '#cbd5e1', border: 'rgba(148, 163, 184, 0.25)' },
    Mármol: { bg: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.25)' },
    Cuarzo: { bg: 'rgba(139, 92, 246, 0.12)', color: '#a78bfa', border: 'rgba(139, 92, 246, 0.25)' },
  };

  const colorSet = materialInfo ? tipoColor[materialInfo.tipo] || tipoColor.Granito : null;

  // Cálculo de precio estimado (solo referencia)
  const precioEstimado =
    materialInfo && formData.cantidad
      ? (materialInfo.precioRef * parseFloat(formData.cantidad)).toLocaleString('es-MX')
      : null;

  return (
    <div className="material-preview-card">
      <div className="preview-header">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
        <h4>Vista Previa del Pedido</h4>
      </div>

      {!hasData ? (
        <div className="preview-empty">
          <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.3 }}>
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <p>Complete el formulario para ver la vista previa de su pedido.</p>
        </div>
      ) : (
        <div className="preview-content">
          {/* Material seleccionado */}
          {materialInfo && (
            <div className="pedido-summary-row">
              <span className="summary-label">Material</span>
              <span className="summary-value">
                <span
                  className="material-badge"
                  style={{
                    background: colorSet.bg,
                    color: colorSet.color,
                    border: `1px solid ${colorSet.border}`,
                  }}
                >
                  {materialInfo.tipo}
                </span>
                {materialInfo.nombre}
              </span>
            </div>
          )}

          {/* Cantidad */}
          {formData.cantidad && (
            <div className="pedido-summary-row">
              <span className="summary-label">Cantidad</span>
              <span className="summary-value">{formData.cantidad} m²</span>
            </div>
          )}

          {/* Grosor */}
          {formData.grosor && (
            <div className="pedido-summary-row">
              <span className="summary-label">Grosor</span>
              <span className="summary-value">{formData.grosor}</span>
            </div>
          )}

          {/* Acabado */}
          {formData.acabado && (
            <div className="pedido-summary-row">
              <span className="summary-label">Acabado</span>
              <span className="summary-value">{formData.acabado}</span>
            </div>
          )}

          {/* Uso */}
          {formData.uso && (
            <div className="pedido-summary-row">
              <span className="summary-label">Uso Previsto</span>
              <span className="summary-value">{formData.uso}</span>
            </div>
          )}

          {/* Fecha */}
          {formData.fechaEntrega && (
            <div className="pedido-summary-row">
              <span className="summary-label">Entrega Deseada</span>
              <span className="summary-value">
                {new Date(formData.fechaEntrega + 'T00:00:00').toLocaleDateString('es-MX', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          )}

          {/* Precio estimado */}
          {precioEstimado && (
            <div className="preview-price-estimate">
              <div className="price-label">Precio Estimado (referencia)</div>
              <div className="price-value">${precioEstimado} MXN</div>
              <p className="price-disclaimer">
                * Precio indicativo. El costo final será confirmado en la cotización oficial.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MaterialCard;

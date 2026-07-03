export const calcularCotizacion = async (tipoProyecto, params) => {
  const response = await fetch('/api/cotizacion/calcular', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tipo_proyecto: tipoProyecto, params })
  });
  
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || 'Error al calcular la cotización');
  }
  return resData;
};

export const crearCotizacion = async (cotizacionData) => {
  const response = await fetch('/api/cotizacion/crear', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cotizacionData)
  });
  
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || 'Error al guardar la cotización');
  }
  return resData;
};

export const descargarPDF = async (cotizacionId) => {
  const response = await fetch(`/api/cotizacion/${cotizacionId}/pdf`);
  if (!response.ok) {
    const errText = await response.text();
    let errMsg = 'Error al descargar el PDF';
    try {
      const errJson = JSON.parse(errText);
      errMsg = errJson.message || errMsg;
    } catch (e) {}
    throw new Error(errMsg);
  }
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cotizacion_${cotizacionId}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

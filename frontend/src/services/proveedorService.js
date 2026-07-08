/**
 * Servicio de Proveedores — Gestión de proveedores y alertas de restock.
 * Datos simulados localmente, preparado para conectar con backend Flask.
 */

// Proveedores precargados con materiales asociados
let proveedores = [
  {
    id: 'prov-001',
    empresa: 'Piedras del Norte S.A.',
    contacto: 'Ing. Roberto Mendoza',
    email: 'rmendoza@piedrasdelnorte.mx',
    telefono: '442 812 3456',
    direccion: 'Carr. Querétaro-SLP Km 24, Querétaro, Qro.',
    rfc: 'PNO180523K91',
    materiales: ['granito-gris-oxford', 'granito-negro-absoluto'],
    umbralAlerta: 5,
    notas: 'Entrega en 5-7 días hábiles. Pedido mínimo 10 m².',
    fechaRegistro: '2026-01-15',
    activo: true,
  },
  {
    id: 'prov-002',
    empresa: 'Mármoles y Canteras GTO',
    contacto: 'Lic. Ana Sofía Barrera',
    email: 'ventas@marmolesygto.mx',
    telefono: '477 654 9821',
    direccion: 'Blvd. Adolfo López Mateos 1200, León, Gto.',
    rfc: 'MCG200115AB3',
    materiales: ['granito-blanco-dallas', 'marmol-carrara', 'marmol-travertino'],
    umbralAlerta: 3,
    notas: 'Importación directa de Italia. Tiempo de entrega 15-20 días para materiales de importación.',
    fechaRegistro: '2026-03-08',
    activo: true,
  },
  {
    id: 'prov-003',
    empresa: 'QuarzMex Internacional',
    contacto: 'Carlos Villanueva',
    email: 'carlos@quarzmex.com',
    telefono: '55 4321 8765',
    direccion: 'Av. Insurgentes Sur 1602, CDMX',
    rfc: 'QMI210901JK5',
    materiales: ['cuarzo-blanco-stellar', 'cuarzo-calacatta'],
    umbralAlerta: 5,
    notas: 'Cuarzo de ingeniería. Garantía de 10 años en materiales.',
    fechaRegistro: '2026-05-20',
    activo: true,
  },
];

// Historial de alertas de restock
let historialAlertas = [
  {
    id: 'ha-001',
    proveedorId: 'prov-002',
    proveedor: 'Mármoles y Canteras GTO',
    email: 'ventas@marmolesygto.mx',
    materialId: 'marmol-travertino',
    material: 'Mármol Travertino',
    stockAlMomento: 2,
    fecha: '2026-07-06T10:30:00',
    tipo: 'automatica',
    estado: 'enviada',
  },
];

// Catálogo de nombres de materiales (para display)
const NOMBRES_MATERIALES = {
  'granito-gris-oxford': 'Granito Gris Oxford',
  'granito-negro-absoluto': 'Granito Negro Absoluto',
  'granito-blanco-dallas': 'Granito Blanco Dallas',
  'marmol-carrara': 'Mármol Carrara',
  'marmol-travertino': 'Mármol Travertino',
  'cuarzo-blanco-stellar': 'Cuarzo Blanco Stellar',
  'cuarzo-calacatta': 'Cuarzo Calacatta',
};

/**
 * Obtiene la lista de proveedores.
 */
export const obtenerProveedores = () => {
  return proveedores.map((p) => ({
    ...p,
    materialesNombres: p.materiales.map((mid) => NOMBRES_MATERIALES[mid] || mid),
  }));
};

/**
 * Crea un nuevo proveedor.
 */
export const crearProveedor = (data) => {
  const nuevo = {
    id: `prov-${Date.now().toString(36)}`,
    ...data,
    fechaRegistro: new Date().toISOString().split('T')[0],
    activo: true,
  };
  proveedores.push(nuevo);
  return { ...nuevo, materialesNombres: nuevo.materiales.map((mid) => NOMBRES_MATERIALES[mid] || mid) };
};

/**
 * Actualiza un proveedor existente.
 */
export const actualizarProveedor = (id, data) => {
  const idx = proveedores.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  proveedores[idx] = { ...proveedores[idx], ...data };
  return proveedores[idx];
};

/**
 * Elimina un proveedor.
 */
export const eliminarProveedor = (id) => {
  const idx = proveedores.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  proveedores.splice(idx, 1);
  return true;
};

/**
 * Busca el proveedor asociado a un material.
 */
export const buscarProveedorPorMaterial = (materialId) => {
  return proveedores.find((p) => p.materiales.includes(materialId)) || null;
};

/**
 * Simula el envío de alerta de restock al proveedor por email.
 */
export const enviarAlertaRestock = (proveedorId, materialId, stockActual) => {
  const prov = proveedores.find((p) => p.id === proveedorId);
  if (!prov) return null;

  const alerta = {
    id: `ha-${Date.now().toString(36)}`,
    proveedorId,
    proveedor: prov.empresa,
    email: prov.email,
    materialId,
    material: NOMBRES_MATERIALES[materialId] || materialId,
    stockAlMomento: stockActual,
    fecha: new Date().toISOString(),
    tipo: 'manual',
    estado: 'enviada',
  };

  historialAlertas.unshift(alerta);
  return alerta;
};

/**
 * Registra alerta automática (cuando stock baja del umbral).
 */
export const registrarAlertaAutomatica = (proveedorId, materialId, stockActual) => {
  const prov = proveedores.find((p) => p.id === proveedorId);
  if (!prov) return null;

  // Verificar si ya se envió alerta para este material recientemente (últimas 24h)
  const alertaReciente = historialAlertas.find(
    (a) => a.materialId === materialId && Date.now() - new Date(a.fecha).getTime() < 86400000
  );
  if (alertaReciente) return null; // No duplicar

  const alerta = {
    id: `ha-${Date.now().toString(36)}`,
    proveedorId,
    proveedor: prov.empresa,
    email: prov.email,
    materialId,
    material: NOMBRES_MATERIALES[materialId] || materialId,
    stockAlMomento: stockActual,
    fecha: new Date().toISOString(),
    tipo: 'automatica',
    estado: 'enviada',
  };

  historialAlertas.unshift(alerta);
  return alerta;
};

/**
 * Obtiene el historial de alertas.
 */
export const obtenerHistorialAlertas = () => {
  return [...historialAlertas];
};

/**
 * Obtiene estadísticas de proveedores.
 */
export const obtenerEstadisticasProveedores = () => {
  return {
    total: proveedores.length,
    activos: proveedores.filter((p) => p.activo).length,
    alertasEnviadas: historialAlertas.length,
  };
};

export { NOMBRES_MATERIALES };

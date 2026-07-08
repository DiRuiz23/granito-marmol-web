/**
 * Servicio de Inventario — Gestión de stock de materiales.
 * Datos simulados localmente, preparado para conectar con backend Flask.
 */

// Inventario inicial con stock, proveedor asociado y umbrales
const INVENTARIO_INICIAL = [
  {
    id: 'granito-gris-oxford',
    nombre: 'Granito Gris Oxford',
    tipo: 'Granito',
    stock: 12,
    unidad: 'm²',
    precioUnitario: 1850,
    proveedorId: 'prov-001',
    proveedor: 'Piedras del Norte S.A.',
    umbralAlerta: 5,
    ultimaActualizacion: '2026-07-05',
  },
  {
    id: 'granito-negro-absoluto',
    nombre: 'Granito Negro Absoluto',
    tipo: 'Granito',
    stock: 4,
    unidad: 'm²',
    precioUnitario: 2200,
    proveedorId: 'prov-001',
    proveedor: 'Piedras del Norte S.A.',
    umbralAlerta: 5,
    ultimaActualizacion: '2026-07-02',
  },
  {
    id: 'granito-blanco-dallas',
    nombre: 'Granito Blanco Dallas',
    tipo: 'Granito',
    stock: 8,
    unidad: 'm²',
    precioUnitario: 1950,
    proveedorId: 'prov-002',
    proveedor: 'Mármoles y Canteras GTO',
    umbralAlerta: 5,
    ultimaActualizacion: '2026-07-06',
  },
  {
    id: 'marmol-carrara',
    nombre: 'Mármol Carrara',
    tipo: 'Mármol',
    stock: 6,
    unidad: 'm²',
    precioUnitario: 3500,
    proveedorId: 'prov-002',
    proveedor: 'Mármoles y Canteras GTO',
    umbralAlerta: 5,
    ultimaActualizacion: '2026-07-04',
  },
  {
    id: 'marmol-travertino',
    nombre: 'Mármol Travertino',
    tipo: 'Mármol',
    stock: 2,
    unidad: 'm²',
    precioUnitario: 2800,
    proveedorId: 'prov-002',
    proveedor: 'Mármoles y Canteras GTO',
    umbralAlerta: 3,
    ultimaActualizacion: '2026-06-28',
  },
  {
    id: 'cuarzo-blanco-stellar',
    nombre: 'Cuarzo Blanco Stellar',
    tipo: 'Cuarzo',
    stock: 15,
    unidad: 'm²',
    precioUnitario: 2600,
    proveedorId: 'prov-003',
    proveedor: 'QuarzMex Internacional',
    umbralAlerta: 5,
    ultimaActualizacion: '2026-07-07',
  },
  {
    id: 'cuarzo-calacatta',
    nombre: 'Cuarzo Calacatta',
    tipo: 'Cuarzo',
    stock: 3,
    unidad: 'm²',
    precioUnitario: 3200,
    proveedorId: 'prov-003',
    proveedor: 'QuarzMex Internacional',
    umbralAlerta: 5,
    ultimaActualizacion: '2026-07-01',
  },
];

// Estado mutable del inventario (simula base de datos)
let inventario = JSON.parse(JSON.stringify(INVENTARIO_INICIAL));

// Historial de alertas enviadas
let historialAlertas = [
  {
    id: 'alert-001',
    materialId: 'marmol-travertino',
    material: 'Mármol Travertino',
    proveedorId: 'prov-002',
    proveedor: 'Mármoles y Canteras GTO',
    email: 'ventas@marmolesygto.mx',
    stockAlMomento: 2,
    fecha: '2026-07-06T10:30:00',
    tipo: 'automatica',
  },
];

/**
 * Obtiene el inventario completo.
 */
export const obtenerInventario = () => {
  return [...inventario];
};

/**
 * Actualiza el stock de un material.
 */
export const actualizarStock = (materialId, nuevaCantidad) => {
  const idx = inventario.findIndex((m) => m.id === materialId);
  if (idx === -1) return null;

  inventario[idx] = {
    ...inventario[idx],
    stock: Math.max(0, nuevaCantidad),
    ultimaActualizacion: new Date().toISOString().split('T')[0],
  };

  return inventario[idx];
};

/**
 * Verifica materiales con stock bajo según su umbral.
 */
export const verificarAlertasStock = () => {
  return inventario.filter((m) => m.stock <= m.umbralAlerta);
};

/**
 * Obtiene materiales en estado crítico (≤3).
 */
export const obtenerCriticos = () => {
  return inventario.filter((m) => m.stock <= 3);
};

/**
 * Simula envío de alerta por email al proveedor.
 */
export const enviarAlertaProveedor = (materialId, proveedorEmail) => {
  const material = inventario.find((m) => m.id === materialId);
  if (!material) return null;

  const alerta = {
    id: `alert-${Date.now().toString(36)}`,
    materialId,
    material: material.nombre,
    proveedorId: material.proveedorId,
    proveedor: material.proveedor,
    email: proveedorEmail || 'proveedor@ejemplo.com',
    stockAlMomento: material.stock,
    fecha: new Date().toISOString(),
    tipo: 'manual',
  };

  historialAlertas.unshift(alerta);
  return alerta;
};

/**
 * Obtiene historial de alertas enviadas.
 */
export const obtenerHistorialAlertas = () => {
  return [...historialAlertas];
};

/**
 * Agrega alerta al historial (usada internamente).
 */
export const registrarAlertaAutomatica = (materialId, proveedorEmail) => {
  const material = inventario.find((m) => m.id === materialId);
  if (!material) return null;

  const alerta = {
    id: `alert-${Date.now().toString(36)}`,
    materialId,
    material: material.nombre,
    proveedorId: material.proveedorId,
    proveedor: material.proveedor,
    email: proveedorEmail || 'proveedor@ejemplo.com',
    stockAlMomento: material.stock,
    fecha: new Date().toISOString(),
    tipo: 'automatica',
  };

  historialAlertas.unshift(alerta);
  return alerta;
};

/**
 * Calcula estadísticas del inventario.
 */
export const obtenerEstadisticas = () => {
  const totalMateriales = inventario.length;
  const totalStock = inventario.reduce((sum, m) => sum + m.stock, 0);
  const valorTotal = inventario.reduce((sum, m) => sum + m.stock * m.precioUnitario, 0);
  const enAlerta = inventario.filter((m) => m.stock <= m.umbralAlerta).length;
  const criticos = inventario.filter((m) => m.stock <= 3).length;
  const agotados = inventario.filter((m) => m.stock === 0).length;

  return { totalMateriales, totalStock, valorTotal, enAlerta, criticos, agotados };
};

/**
 * Determina el estado de un material según su stock.
 */
export const getEstadoStock = (stock, umbral) => {
  if (stock === 0) return { label: 'Agotado', color: '#6b7280', clase: 'agotado' };
  if (stock <= 3) return { label: 'Crítico', color: '#ef4444', clase: 'critico' };
  if (stock <= umbral) return { label: 'Stock Bajo', color: '#f59e0b', clase: 'bajo' };
  return { label: 'Disponible', color: '#10b981', clase: 'disponible' };
};

/**
 * Servicio para gestionar pedidos de material.
 * Preparado para conectar con el backend Flask.
 * Mientras no haya backend activo, simula respuestas locales.
 */

// Catálogo de materiales disponibles en el taller
const CATALOGO_MATERIALES = [
  { id: 'granito-gris-oxford', nombre: 'Granito Gris Oxford', tipo: 'Granito', precioRef: 1850, disponible: true },
  { id: 'granito-negro-absoluto', nombre: 'Granito Negro Absoluto', tipo: 'Granito', precioRef: 2200, disponible: true },
  { id: 'granito-blanco-dallas', nombre: 'Granito Blanco Dallas', tipo: 'Granito', precioRef: 1950, disponible: true },
  { id: 'marmol-carrara', nombre: 'Mármol Carrara', tipo: 'Mármol', precioRef: 3500, disponible: true },
  { id: 'marmol-travertino', nombre: 'Mármol Travertino', tipo: 'Mármol', precioRef: 2800, disponible: false },
  { id: 'cuarzo-blanco-stellar', nombre: 'Cuarzo Blanco Stellar', tipo: 'Cuarzo', precioRef: 2600, disponible: true },
  { id: 'cuarzo-calacatta', nombre: 'Cuarzo Calacatta', tipo: 'Cuarzo', precioRef: 3200, disponible: true },
];

const ACABADOS = ['Pulido', 'Mate', 'Flameado', 'Apomazado'];
const GROSORES = ['2 cm', '3 cm'];
const USOS = ['Cocina', 'Baño', 'Piso', 'Fachada', 'Otro'];

/**
 * Obtiene el catálogo de materiales disponibles.
 * @returns {Promise<Array>} Lista de materiales
 */
export const obtenerMateriales = async () => {
  try {
    const res = await fetch('/api/materiales');
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch {
    // Backend no disponible, retornar catálogo local
  }
  return CATALOGO_MATERIALES;
};

/**
 * Envía un pedido de material al servidor.
 * @param {Object} pedido - Datos del pedido
 * @returns {Promise<Object>} Respuesta con folio
 */
export const crearPedido = async (pedido) => {
  try {
    const res = await fetch('/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedido),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Backend no disponible, simular respuesta
  }
  // Simulación local: generar folio
  const folio = `PED-${Date.now().toString(36).toUpperCase()}`;
  return {
    ok: true,
    folio,
    message: `Pedido registrado exitosamente con folio ${folio}`,
  };
};

/**
 * Busca un material por su ID en el catálogo.
 * @param {string} materialId - ID del material
 * @returns {Object|null} Material encontrado
 */
export const buscarMaterial = (materialId) => {
  return CATALOGO_MATERIALES.find((m) => m.id === materialId) || null;
};

export { CATALOGO_MATERIALES, ACABADOS, GROSORES, USOS };

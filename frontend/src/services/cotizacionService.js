/**
 * Servicio de Cotización — Generador de cotizaciones con cálculos automáticos.
 * Datos simulados localmente, preparado para conectar con backend Flask.
 */

import { CATALOGO_MATERIALES, ACABADOS, GROSORES } from './pedidoService';

const IVA_PORCENTAJE = 16;

// Precios adicionales por acabado
const PRECIOS_ACABADO = {
  Pulido: 0,
  Mate: 150,
  Flameado: 250,
  Apomazado: 200,
};

// Precios adicionales por grosor
const PRECIOS_GROSOR = {
  '2 cm': 0,
  '3 cm': 350,
};

/**
 * Calcula el subtotal de un item de cotización.
 */
export const calcularSubtotalItem = (materialId, cantidad, acabado, grosor) => {
  const material = CATALOGO_MATERIALES.find((m) => m.id === materialId);
  if (!material || !cantidad) return 0;

  const precioBase = material.precioRef;
  const extraAcabado = PRECIOS_ACABADO[acabado] || 0;
  const extraGrosor = PRECIOS_GROSOR[grosor] || 0;

  return (precioBase + extraAcabado + extraGrosor) * parseFloat(cantidad);
};

/**
 * Calcula los totales de una cotización completa.
 */
export const calcularTotales = (items) => {
  const subtotal = items.reduce((sum, item) => {
    return sum + calcularSubtotalItem(item.material, item.cantidad, item.acabado, item.grosor);
  }, 0);

  const iva = subtotal * (IVA_PORCENTAJE / 100);
  const total = subtotal + iva;

  return { subtotal, iva, total, ivaPorcentaje: IVA_PORCENTAJE };
};

/**
 * Genera un número de folio de cotización.
 */
export const generarFolio = () => {
  const fecha = new Date();
  const year = fecha.getFullYear().toString().slice(-2);
  const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 9000 + 1000);
  return `COT-${year}${month}-${random}`;
};

/**
 * Genera una cotización completa.
 */
export const generarCotizacion = (items, cliente) => {
  const folio = generarFolio();
  const totales = calcularTotales(items);
  const fecha = new Date().toISOString();

  const itemsDetallados = items.map((item) => {
    const material = CATALOGO_MATERIALES.find((m) => m.id === item.material);
    return {
      ...item,
      materialNombre: material ? material.nombre : 'Desconocido',
      materialTipo: material ? material.tipo : '',
      precioUnitario: material ? material.precioRef : 0,
      subtotal: calcularSubtotalItem(item.material, item.cantidad, item.acabado, item.grosor),
    };
  });

  return {
    ok: true,
    folio,
    fecha,
    cliente,
    items: itemsDetallados,
    ...totales,
  };
};

/**
 * Formatea un número como moneda MXN.
 */
export const formatMXN = (valor) => {
  return valor.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export { CATALOGO_MATERIALES, ACABADOS, GROSORES, IVA_PORCENTAJE, PRECIOS_ACABADO, PRECIOS_GROSOR };

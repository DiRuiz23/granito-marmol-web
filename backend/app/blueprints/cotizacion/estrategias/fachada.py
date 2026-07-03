from app.blueprints.cotizacion.estrategias.base import CotizacionEstrategia

class FachadaEstrategia(CotizacionEstrategia):
    def calcular(self, params: dict) -> dict:
        metros_cuadrados = float(params.get('metros_cuadrados', 0))
        material_key = params.get('material_key', 'granito_gris_oxford')
        tipo_soporte = params.get('tipo_soporte', 'adhesivo') # adhesivo, grapas
        instalacion_requerida = bool(params.get('instalacion_requerida', False))

        material_info = self.PRECIOS_PIEDRA.get(material_key, self.PRECIOS_PIEDRA['granito_gris_oxford'])
        precio_m2 = material_info['precio']
        nombre_material = material_info['nombre']

        items = []
        
        # 1. Base material cost (per m2)
        costo_material = metros_cuadrados * precio_m2
        items.append({
            'concepto': f'Suministro de material en placas: {nombre_material}',
            'cantidad': metros_cuadrados,
            'unidad': 'm²',
            'precio_unitario': precio_m2,
            'total': costo_material
        })

        # 2. Fixation / Support
        precios_soporte = {
            'adhesivo': 150.0,
            'grapas': 300.0
        }
        precio_soporte_unitario = precios_soporte.get(tipo_soporte, 150.0)
        items.append({
            'concepto': f'Soporte y fijación de fachada ({tipo_soporte.capitalize()})',
            'cantidad': metros_cuadrados,
            'unidad': 'm²',
            'precio_unitario': precio_soporte_unitario,
            'total': metros_cuadrados * precio_soporte_unitario
        })

        # 3. Installation
        if instalacion_requerida:
            precio_instalacion_m2 = 400.0
            items.append({
                'concepto': 'Instalación y anclaje profesional de fachada',
                'cantidad': metros_cuadrados,
                'unidad': 'm²',
                'precio_unitario': precio_instalacion_m2,
                'total': metros_cuadrados * precio_instalacion_m2
            })

        subtotal = sum(item['total'] for item in items)
        iva = subtotal * 0.16
        total = subtotal + iva

        return {
            'tipo_proyecto': 'Fachada',
            'material': nombre_material,
            'items': items,
            'subtotal': round(subtotal, 2),
            'iva': round(iva, 2),
            'total': round(total, 2)
        }

from app.blueprints.cotizacion.estrategias.base import CotizacionEstrategia

class BanoEstrategia(CotizacionEstrategia):
    def calcular(self, params: dict) -> dict:
        metros_lineales = float(params.get('metros_lineales', 0))
        material_key = params.get('material_key', 'granito_gris_oxford')
        cortes_lavabo = int(params.get('cortes_lavabo', 0))
        faldon_requerido = bool(params.get('faldon_requerido', False))
        borde_acabado = params.get('borde_acabado', 'recto')
        instalacion_requerida = bool(params.get('instalacion_requerida', False))

        material_info = self.PRECIOS_PIEDRA.get(material_key, self.PRECIOS_PIEDRA['granito_gris_oxford'])
        precio_m_lineal = material_info['precio']
        nombre_material = material_info['nombre']

        items = []
        
        # 1. Base material cost
        costo_material = metros_lineales * precio_m_lineal
        items.append({
            'concepto': f'Suministro de material: {nombre_material}',
            'cantidad': metros_lineales,
            'unidad': 'ml',
            'precio_unitario': precio_m_lineal,
            'total': costo_material
        })
        
        # 2. Sink holes (ovalín)
        if cortes_lavabo > 0:
            precio_corte_lavabo = 500.0
            items.append({
                'concepto': 'Corte y pulido de hueco para lavabo/ovalín',
                'cantidad': cortes_lavabo,
                'unidad': 'pza',
                'precio_unitario': precio_corte_lavabo,
                'total': cortes_lavabo * precio_corte_lavabo
            })

        # 3. Faldón frontal (apron/skirt)
        if faldon_requerido:
            precio_faldon = 600.0
            items.append({
                'concepto': f'Faldón frontal de protección ({nombre_material})',
                'cantidad': metros_lineales,
                'unidad': 'ml',
                'precio_unitario': precio_faldon,
                'total': metros_lineales * precio_faldon
            })

        # 4. Edges
        precios_borde = {
            'recto': 0.0,
            'boleado': 450.0,
            'inglete': 600.0
        }
        costo_borde_unitario = precios_borde.get(borde_acabado, 0.0)
        if costo_borde_unitario > 0:
            items.append({
                'concepto': f'Acabado de borde: {borde_acabado.capitalize()}',
                'cantidad': metros_lineales,
                'unidad': 'ml',
                'precio_unitario': costo_borde_unitario,
                'total': metros_lineales * costo_borde_unitario
            })

        # 5. Installation
        if instalacion_requerida:
            precio_instalacion = 1000.0
            items.append({
                'concepto': 'Instalación y sellado profesional en sitio',
                'cantidad': 1,
                'unidad': 'serv',
                'precio_unitario': precio_instalacion,
                'total': precio_instalacion
            })

        items = self.agregar_conceptos_adicionales(items, params)
        subtotal = sum(item['total'] for item in items)
        iva = subtotal * 0.16
        total = subtotal + iva

        return {
            'tipo_proyecto': 'Baño',
            'material': nombre_material,
            'items': items,
            'subtotal': round(subtotal, 2),
            'iva': round(iva, 2),
            'total': round(total, 2)
        }

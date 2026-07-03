from app.blueprints.cotizacion.estrategias.base import CotizacionEstrategia

class EscaleraEstrategia(CotizacionEstrategia):
    def calcular(self, params: dict) -> dict:
        numero_escalones = int(params.get('numero_escalones', 0))
        longitud_escalon = float(params.get('longitud_escalon', 1.0))
        material_key = params.get('material_key', 'marmol_carrara')
        peralte_incluido = bool(params.get('peralte_incluido', False))
        instalacion_requerida = bool(params.get('instalacion_requerida', False))

        material_info = self.PRECIOS_PIEDRA.get(material_key, self.PRECIOS_PIEDRA['marmol_carrara'])
        precio_base = material_info['precio']
        nombre_material = material_info['nombre']

        items = []
        
        # 1. Huella (Step tread)
        ancho_huella = 0.3
        precio_huella = precio_base * ancho_huella
        costo_huellas = numero_escalones * longitud_escalon * precio_huella
        items.append({
            'concepto': f'Suministro de huellas de escalón ({nombre_material}) - {ancho_huella}m ancho',
            'cantidad': numero_escalones * longitud_escalon,
            'unidad': 'ml',
            'precio_unitario': precio_huella,
            'total': costo_huellas
        })

        # 2. Peralte (Step riser)
        if peralte_incluido:
            ancho_peralte = 0.18
            precio_peralte = precio_base * ancho_peralte
            costo_peraltes = numero_escalones * longitud_escalon * precio_peralte
            items.append({
                'concepto': f'Suministro de peraltes de escalón ({nombre_material}) - {ancho_peralte}m alto',
                'cantidad': numero_escalones * longitud_escalon,
                'unidad': 'ml',
                'precio_unitario': precio_peralte,
                'total': costo_peraltes
            })

        # 3. Step nose polishing/canto
        precio_pulido_borde = 150.0
        items.append({
            'concepto': 'Pulido y boleado de nariz de escalón',
            'cantidad': numero_escalones * longitud_escalon,
            'unidad': 'ml',
            'precio_unitario': precio_pulido_borde,
            'total': numero_escalones * longitud_escalon * precio_pulido_borde
        })

        # 4. Installation
        if instalacion_requerida:
            precio_instalacion_escalon = 250.0
            items.append({
                'concepto': 'Instalación y nivelación de escalones en sitio',
                'cantidad': numero_escalones,
                'unidad': 'pza',
                'precio_unitario': precio_instalacion_escalon,
                'total': numero_escalones * precio_instalacion_escalon
            })

        subtotal = sum(item['total'] for item in items)
        iva = subtotal * 0.16
        total = subtotal + iva

        return {
            'tipo_proyecto': 'Escalera',
            'material': nombre_material,
            'items': items,
            'subtotal': round(subtotal, 2),
            'iva': round(iva, 2),
            'total': round(total, 2)
        }

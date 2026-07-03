from abc import ABC, abstractmethod

class CotizacionEstrategia(ABC):
    
    # Base prices of stone materials (typically linear meter for countertops, m2 for slabs/facades)
    PRECIOS_PIEDRA = {
        'granito_gris_oxford': {'nombre': 'Granito Gris Oxford', 'precio': 3200.0},
        'marmol_carrara': {'nombre': 'Mármol Carrara', 'precio': 4500.0},
        'cuarzo_blanco_estelar': {'nombre': 'Cuarzo Blanco Estelar', 'precio': 5200.0},
        'granito_negro_absoluto': {'nombre': 'Granito Negro Absoluto', 'precio': 5800.0}
    }
    
    @abstractmethod
    def calcular(self, params: dict) -> dict:
        """
        Performs the price calculation based on input parameters.
        params: dict of input details.
        returns: dict with item breakdown, subtotal, iva, total.
        """
        pass

    def agregar_conceptos_adicionales(self, items: list, params: dict) -> list:
        costo_mat = float(params.get('costo_materiales_adicionales', 0))
        mano_obra = float(params.get('mano_de_obra_adicional', 0))
        
        if costo_mat > 0:
            items.append({
                'concepto': 'Materiales adicionales del proyecto',
                'cantidad': 1,
                'unidad': 'lote',
                'precio_unitario': costo_mat,
                'total': costo_mat
            })
            
        if mano_obra > 0:
            items.append({
                'concepto': 'Mano de obra y fabricación artística adicional',
                'cantidad': 1,
                'unidad': 'lote',
                'precio_unitario': mano_obra,
                'total': mano_obra
            })
            
        return items


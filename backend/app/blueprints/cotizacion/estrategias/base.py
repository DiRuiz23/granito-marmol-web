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

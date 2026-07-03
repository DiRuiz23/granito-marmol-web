from app.prototypes.base import PlantillaProyecto


class PlantillaCubiertaBano(PlantillaProyecto):
    """
    Prototype: Cubierta estándar de baño principal con lavabo integrado y faldón.
    Ideal para renovaciones de baño de tamaño medio.
    """

    def __init__(self):
        super().__init__()
        self.tipo_proyecto = "bano"
        self.material_key = "marmol_carrara"
        self.nombre_plantilla = "Cubierta de Baño Principal"
        self.descripcion = (
            "Cubierta de 1.5 ml en Mármol Carrara con corte para lavabo, "
            "faldón frontal y canto boleado. Instalación profesional incluida."
        )
        self.params = {
            "material_key": "marmol_carrara",
            "metros_lineales": 1.5,
            "cortes_lavabo": 1,
            "faldon_requerido": True,
            "borde_acabado": "boleado",
            "instalacion_requerida": True,
            "presupuesto": 0,
            "costo_materiales_adicionales": 0,
            "mano_de_obra_adicional": 0
        }

    def to_dict(self) -> dict:
        return self._base_dict()


class PlantillaBanoDobleVanity(PlantillaProyecto):
    """
    Prototype: Cubierta doble vanity con dos lavabos para baño principal de suite.
    """

    def __init__(self):
        super().__init__()
        self.tipo_proyecto = "bano"
        self.material_key = "granito_negro_absoluto"
        self.nombre_plantilla = "Doble Vanity Suite Master"
        self.descripcion = (
            "Cubierta de 2.4 ml en Granito Negro Absoluto con dos cortes de lavabo, "
            "sin faldón, canto inglete y servicio de instalación."
        )
        self.params = {
            "material_key": "granito_negro_absoluto",
            "metros_lineales": 2.4,
            "cortes_lavabo": 2,
            "faldon_requerido": False,
            "borde_acabado": "inglete",
            "instalacion_requerida": True,
            "presupuesto": 0,
            "costo_materiales_adicionales": 0,
            "mano_de_obra_adicional": 0
        }

    def to_dict(self) -> dict:
        return self._base_dict()

from app.prototypes.base import PlantillaProyecto


class PlantillaCocinaIntegral(PlantillaProyecto):
    """
    Prototype: Plantilla estándar para cocina integral con isla central.
    Pre-configurada con materiales de alta demanda y dimensiones típicas.
    """

    def __init__(self):
        super().__init__()
        self.tipo_proyecto = "cocina"
        self.material_key = "granito_gris_oxford"
        self.nombre_plantilla = "Cocina Integral Estándar"
        self.descripcion = (
            "Cubierta corrida de 3.5 ml con zoclo, un corte para tarja "
            "y uno para estufa empotrada. Canto boleado e instalación incluidos."
        )
        self.params = {
            "material_key": "granito_gris_oxford",
            "metros_lineales": 3.5,
            "metros_zoclo": 3.5,
            "cortes_estufa": 1,
            "cortes_tarja": 1,
            "borde_acabado": "boleado",
            "instalacion_requerida": True,
            "presupuesto": 0,
            "costo_materiales_adicionales": 0,
            "mano_de_obra_adicional": 0
        }

    def to_dict(self) -> dict:
        return self._base_dict()


class PlantillaCocinaLujo(PlantillaProyecto):
    """
    Prototype: Cocina de lujo con cuarzo, mayor metraje y acabado inglete.
    Ideal para proyectos residenciales premium o de alta gama.
    """

    def __init__(self):
        super().__init__()
        self.tipo_proyecto = "cocina"
        self.material_key = "cuarzo_blanco_estelar"
        self.nombre_plantilla = "Cocina Premium con Cuarzo"
        self.descripcion = (
            "Cubierta de 5.0 ml en Cuarzo Blanco Estelar, zoclo completo, "
            "dos cortes, borde inglete a 45° y servicio de instalación."
        )
        self.params = {
            "material_key": "cuarzo_blanco_estelar",
            "metros_lineales": 5.0,
            "metros_zoclo": 5.0,
            "cortes_estufa": 1,
            "cortes_tarja": 2,
            "borde_acabado": "inglete",
            "instalacion_requerida": True,
            "presupuesto": 0,
            "costo_materiales_adicionales": 0,
            "mano_de_obra_adicional": 0
        }

    def to_dict(self) -> dict:
        return self._base_dict()

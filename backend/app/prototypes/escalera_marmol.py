from app.prototypes.base import PlantillaProyecto


class PlantillaEscaleraMarmol(PlantillaProyecto):
    """
    Prototype: Escalera residencial estándar de 12 escalones en Mármol Carrara.
    Longitud típica de 1.2 ml con peralte y boleado de nariz incluidos.
    """

    def __init__(self):
        super().__init__()
        self.tipo_proyecto = "escalera"
        self.material_key = "marmol_carrara"
        self.nombre_plantilla = "Escalera Residencial Mármol"
        self.descripcion = (
            "12 escalones de Mármol Carrara a 1.2 ml de longitud. "
            "Incluye peralte, nariz boleada e instalación paso a paso."
        )
        self.params = {
            "material_key": "marmol_carrara",
            "numero_escalones": 12,
            "longitud_escalon": 1.2,
            "peralte_incluido": True,
            "instalacion_requerida": True,
            "presupuesto": 0,
            "costo_materiales_adicionales": 0,
            "mano_de_obra_adicional": 0
        }

    def to_dict(self) -> dict:
        return self._base_dict()


class PlantillaEscaleraGranito(PlantillaProyecto):
    """
    Prototype: Escalera de acceso comercial en Granito Negro Absoluto.
    Mayor resistencia al tráfico intenso.
    """

    def __init__(self):
        super().__init__()
        self.tipo_proyecto = "escalera"
        self.material_key = "granito_negro_absoluto"
        self.nombre_plantilla = "Escalera Comercial Granito Negro"
        self.descripcion = (
            "8 escalones de Granito Negro Absoluto a 1.5 ml de ancho. "
            "Sin peralte, nariz boleada e instalación incluidos."
        )
        self.params = {
            "material_key": "granito_negro_absoluto",
            "numero_escalones": 8,
            "longitud_escalon": 1.5,
            "peralte_incluido": False,
            "instalacion_requerida": True,
            "presupuesto": 0,
            "costo_materiales_adicionales": 0,
            "mano_de_obra_adicional": 0
        }

    def to_dict(self) -> dict:
        return self._base_dict()

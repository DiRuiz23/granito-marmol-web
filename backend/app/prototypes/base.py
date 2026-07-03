import copy
from abc import ABC, abstractmethod


class PlantillaProyecto(ABC):
    """
    Clase base abstracta para el Prototype Pattern.
    Define la interfaz de clonación y los datos compartidos por todas las plantillas.
    """

    def __init__(self):
        self.tipo_proyecto: str = ""
        self.material_key: str = ""
        self.nombre_plantilla: str = ""
        self.descripcion: str = ""
        self.params: dict = {}

    def clone(self) -> "PlantillaProyecto":
        """Retorna una copia profunda (deep copy) de esta plantilla."""
        return copy.deepcopy(self)

    @abstractmethod
    def to_dict(self) -> dict:
        """Serializa la plantilla como diccionario listo para la API."""
        pass

    def _base_dict(self) -> dict:
        return {
            "tipo_proyecto": self.tipo_proyecto,
            "nombre_plantilla": self.nombre_plantilla,
            "descripcion": self.descripcion,
            "material_key": self.material_key,
            "params": self.params.copy()
        }

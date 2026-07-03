"""
Prototype Registry: central store for all project template prototypes.
Uses the Prototype Pattern — clones the template to avoid mutating the original.
"""
from app.prototypes.cocina_integral import PlantillaCocinaIntegral, PlantillaCocinaLujo
from app.prototypes.cubierta_bano import PlantillaCubiertaBano, PlantillaBanoDobleVanity
from app.prototypes.escalera_marmol import PlantillaEscaleraMarmol, PlantillaEscaleraGranito

# Registry: key -> prototype instance
_REGISTRO: dict = {
    "cocina_estandar": PlantillaCocinaIntegral(),
    "cocina_premium":  PlantillaCocinaLujo(),
    "bano_principal":  PlantillaCubiertaBano(),
    "bano_doble_vanity": PlantillaBanoDobleVanity(),
    "escalera_marmol": PlantillaEscaleraMarmol(),
    "escalera_granito": PlantillaEscaleraGranito(),
}


def listar_plantillas() -> list[dict]:
    """Returns summary list of all registered templates."""
    return [
        {
            "key": key,
            **proto.to_dict()
        }
        for key, proto in _REGISTRO.items()
    ]


def obtener_plantilla(key: str):
    """
    Returns a CLONE of the requested template so callers can modify it freely
    without corrupting the original prototype.
    Returns None if key not found.
    """
    proto = _REGISTRO.get(key)
    if proto is None:
        return None
    return proto.clone()

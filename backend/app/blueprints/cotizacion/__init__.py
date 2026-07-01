from flask import Blueprint

cotizacion_bp = Blueprint("cotizacion", __name__)

from app.blueprints.cotizacion import routes  # noqa: E402, F401
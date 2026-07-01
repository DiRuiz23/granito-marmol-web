from flask import Blueprint

inventario_bp = Blueprint("inventario", __name__)

from app.blueprints.inventario import routes  # noqa: E402, F401
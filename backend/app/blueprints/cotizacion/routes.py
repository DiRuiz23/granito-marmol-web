from flask import jsonify
from app.blueprints.cotizacion import cotizacion_bp


@cotizacion_bp.route("/", methods=["GET"])
def listar_cotizaciones():
    # TODO: implementar en issue #11
    return jsonify({"mensaje": "Blueprint cotizacion activo", "data": []}), 200
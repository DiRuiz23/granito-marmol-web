from flask import jsonify
from app.blueprints.inventario import inventario_bp


@inventario_bp.route("/", methods=["GET"])
def listar_inventario():
    # TODO: implementar en issue #13
    return jsonify({"mensaje": "Blueprint inventario activo", "data": []}), 200
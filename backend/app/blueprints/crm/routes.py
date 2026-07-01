from flask import jsonify
from app.blueprints.crm import crm_bp


@crm_bp.route("/clientes", methods=["GET"])
def listar_clientes():
    # TODO: implementar en issue #14
    return jsonify({"mensaje": "Blueprint CRM activo", "data": []}), 200
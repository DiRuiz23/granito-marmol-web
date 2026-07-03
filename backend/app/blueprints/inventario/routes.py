from flask import Blueprint, jsonify

inventario_bp = Blueprint('inventario', __name__)

@inventario_bp.route('/', methods=['GET'])
def index():
    return jsonify({'ok': True, 'message': 'Inventario Blueprint active'})

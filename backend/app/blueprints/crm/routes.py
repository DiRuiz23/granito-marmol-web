from flask import Blueprint, jsonify

crm_bp = Blueprint('crm', __name__)

@crm_bp.route('/', methods=['GET'])
def index():
    return jsonify({'ok': True, 'message': 'CRM Blueprint active'})

from flask import Blueprint, request, jsonify, send_file
from app.extensions import db
from app.models.cliente import Cliente
from app.models.cotizacion import Cotizacion
from app.blueprints.cotizacion.generator import CotizacionPDFGenerator

# Import strategies
from app.blueprints.cotizacion.estrategias.cocina import CocinaEstrategia
from app.blueprints.cotizacion.estrategias.bano import BanoEstrategia
from app.blueprints.cotizacion.estrategias.escalera import EscaleraEstrategia
from app.blueprints.cotizacion.estrategias.fachada import FachadaEstrategia

cotizacion_bp = Blueprint('cotizacion', __name__)

# Map project type to the concrete Strategy class
ESTRATEGIAS = {
    'cocina': CocinaEstrategia,
    'bano': BanoEstrategia,
    'escalera': EscaleraEstrategia,
    'fachada': FachadaEstrategia
}

@cotizacion_bp.route('/calcular', methods=['POST'])
def calcular():
    data = request.json or {}
    tipo_proyecto = data.get('tipo_proyecto', '').lower()
    params = data.get('params', {})

    if tipo_proyecto not in ESTRATEGIAS:
        return jsonify({
            'ok': False,
            'message': f'Tipo de proyecto no soportado: {tipo_proyecto}. Tipos válidos: {list(ESTRATEGIAS.keys())}'
        }), 400

    try:
        strategy_class = ESTRATEGIAS[tipo_proyecto]
        strategy = strategy_class()
        resultado = strategy.calcular(params)
        return jsonify({
            'ok': True,
            'data': resultado
        })
    except Exception as e:
        return jsonify({
            'ok': False,
            'message': 'Error al calcular la cotización',
            'details': str(e)
        }), 500


@cotizacion_bp.route('/crear', methods=['POST'])
def crear():
    data = request.json or {}
    client_data = data.get('cliente', {})
    tipo_proyecto = data.get('tipo_proyecto', '')
    material = data.get('material', '')
    params = data.get('params', {})
    
    subtotal = data.get('subtotal')
    iva = data.get('iva')
    total = data.get('total')

    if not client_data.get('nombre') or not client_data.get('email') or not client_data.get('telefono'):
        return jsonify({'ok': False, 'message': 'Datos del cliente incompletos (nombre, email, telefono requeridos)'}), 400

    if subtotal is None or iva is None or total is None:
        return jsonify({'ok': False, 'message': 'Totales financieros faltantes'}), 400

    try:
        cliente = Cliente.query.filter_by(email=client_data['email']).first()
        if not cliente:
            cliente = Cliente(
                nombre=client_data['nombre'],
                email=client_data['email'],
                telefono=client_data['telefono'],
                direccion=client_data.get('direccion')
            )
            db.session.add(cliente)
            db.session.flush()

        cotizacion = Cotizacion(
            cliente_id=cliente.id,
            tipo_proyecto=tipo_proyecto,
            material=material,
            subtotal=subtotal,
            iva=iva,
            total=total
        )
        cotizacion.parametros = params
        
        db.session.add(cotizacion)
        db.session.commit()

        return jsonify({
            'ok': True,
            'message': 'Cotización creada con éxito',
            'data': cotizacion.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'ok': False,
            'message': 'Error al registrar la cotización',
            'details': str(e)
        }), 500


@cotizacion_bp.route('/<int:cotizacion_id>', methods=['GET'])
def obtener_detalle(cotizacion_id):
    cotizacion = Cotizacion.query.get(cotizacion_id)
    if not cotizacion:
        return jsonify({'ok': False, 'message': 'Cotización no encontrada'}), 404
        
    return jsonify({
        'ok': True,
        'data': cotizacion.to_dict()
    })


@cotizacion_bp.route('/<int:cotizacion_id>/pdf', methods=['GET'])
def descargar_pdf(cotizacion_id):
    cotizacion = Cotizacion.query.get(cotizacion_id)
    if not cotizacion:
        return jsonify({'ok': False, 'message': 'Cotización no encontrada'}), 404

    try:
        data = cotizacion.to_dict()
        
        tipo_proyecto_key = cotizacion.tipo_proyecto.lower()
        if tipo_proyecto_key in ESTRATEGIAS:
            strategy = ESTRATEGIAS[tipo_proyecto_key]()
            breakdown = strategy.calcular(cotizacion.parametros)
            data['items'] = breakdown.get('items', [])
        else:
            data['items'] = []

        pdf_buffer = CotizacionPDFGenerator.generate_pdf(data)
        
        return send_file(
            pdf_buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f'cotizacion_{cotizacion_id}.pdf'
        )
    except Exception as e:
        return jsonify({
            'ok': False,
            'message': 'Error al generar el archivo PDF',
            'details': str(e)
        }), 500

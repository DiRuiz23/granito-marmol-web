from flask import Flask
from flask_cors import CORS
from app.config import Config
from app.extensions import db

# Import models so SQLAlchemy registers them
from app.models.cliente import Cliente
from app.models.cotizacion import Cotizacion

# Import blueprints
from app.blueprints.cotizacion import cotizacion_bp
from app.blueprints.crm import crm_bp
from app.blueprints.inventario import inventario_bp

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Enable CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Initialize extensions
    db.init_app(app)

    # Register blueprints
    app.register_blueprint(cotizacion_bp, url_prefix='/api/cotizacion')
    app.register_blueprint(crm_bp, url_prefix='/api/crm')
    app.register_blueprint(inventario_bp, url_prefix='/api/inventario')

    # Create tables automatically inside application context
    with app.app_context():
        db.create_all()

    return app

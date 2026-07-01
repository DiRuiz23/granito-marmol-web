from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_socketio import SocketIO

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
limiter = Limiter(key_func=get_remote_address)
socketio = SocketIO()


def create_app():
    app = Flask(__name__)

    # Configuracion
    app.config.from_object("app.config.Config")

    # Inicializar extensiones
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    limiter.init_app(app)
    CORS(app, origins=app.config.get("CORS_ORIGINS", ["http://localhost:3000"]))
    socketio.init_app(app, cors_allowed_origins="*")

    # Registrar blueprints
    from app.blueprints.cotizacion import cotizacion_bp
    from app.blueprints.inventario import inventario_bp
    from app.blueprints.crm import crm_bp

    app.register_blueprint(cotizacion_bp, url_prefix="/api/cotizaciones")
    app.register_blueprint(inventario_bp, url_prefix="/api/inventario")
    app.register_blueprint(crm_bp, url_prefix="/api/crm")

    # Ruta de salud
    @app.route("/api/health")
    def health():
        return {"status": "ok", "service": "granito-marmol-backend"}, 200

    return app
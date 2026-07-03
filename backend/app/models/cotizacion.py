from app.extensions import db
from datetime import datetime
import json

class Cotizacion(db.Model):
    __tablename__ = 'cotizaciones'
    
    id = db.Column(db.Integer, primary_key=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id'), nullable=False)
    tipo_proyecto = db.Column(db.String(50), nullable=False) # cocina, bano, escalera, fachada
    material = db.Column(db.String(100), nullable=False)
    subtotal = db.Column(db.Float, nullable=False)
    iva = db.Column(db.Float, nullable=False)
    total = db.Column(db.Float, nullable=False)
    fecha = db.Column(db.DateTime, default=datetime.utcnow)
    parametros_json = db.Column(db.Text, nullable=False) # Guardamos los parametros de calculo como JSON
    
    cliente = db.relationship('Cliente', back_populates='cotizaciones')

    @property
    def parametros(self):
        try:
            return json.loads(self.parametros_json) if self.parametros_json else {}
        except Exception:
            return {}

    @parametros.setter
    def parametros(self, val):
        self.parametros_json = json.dumps(val)

    def to_dict(self):
        return {
            'id': self.id,
            'cliente_id': self.cliente_id,
            'tipo_proyecto': self.tipo_proyecto,
            'material': self.material,
            'subtotal': self.subtotal,
            'iva': self.iva,
            'total': self.total,
            'fecha': self.fecha.isoformat(),
            'parametros': self.parametros,
            'cliente': self.cliente.to_dict() if self.cliente else None
        }

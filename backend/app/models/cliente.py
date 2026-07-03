from app.extensions import db

class Cliente(db.Model):
    __tablename__ = 'clientes'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), nullable=False, unique=True)
    telefono = db.Column(db.String(20), nullable=False)
    direccion = db.Column(db.String(300), nullable=True)
    
    cotizaciones = db.relationship('Cotizacion', back_populates='cliente', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'email': self.email,
            'telefono': self.telefono,
            'direccion': self.direccion
        }

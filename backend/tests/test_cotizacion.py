import unittest
import io
from app import create_app
from app.extensions import db
from app.blueprints.cotizacion.estrategias.cocina import CocinaEstrategia
from app.blueprints.cotizacion.estrategias.bano import BanoEstrategia
from app.blueprints.cotizacion.estrategias.escalera import EscaleraEstrategia
from app.blueprints.cotizacion.estrategias.fachada import FachadaEstrategia
from app.blueprints.cotizacion.generator import CotizacionPDFGenerator

class CotizacionTestCase(unittest.TestCase):
    
    def setUp(self):
        # Create app configured for testing
        self.app = create_app()
        self.app.config['TESTING'] = True
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:' # In-memory DB
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()
        
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_cocina_estrategia(self):
        estrategia = CocinaEstrategia()
        params = {
            'metros_lineales': '3.5',
            'material_key': 'granito_gris_oxford', # price: 3200
            'cortes_estufa': '1',                  # price: 500
            'cortes_tarja': '1',                   # price: 600
            'metros_zoclo': '3.5',                  # price: 400
            'borde_acabado': 'boleado',            # price: 450
            'instalacion_requerida': True          # price: 1500
        }
        
        resultado = estrategia.calcular(params)
        
        # Expected Math:
        # Material: 3.5 * 3200 = 11,200
        # Estufa: 1 * 500 = 500
        # Tarja: 1 * 600 = 600
        # Zoclo: 3.5 * 400 = 1,400
        # Borde: 3.5 * 450 = 1,575
        # Instalacion: 1500
        # Subtotal = 11200 + 500 + 600 + 1400 + 1575 + 1500 = 16,775
        # IVA = 16775 * 0.16 = 2,684
        # Total = 16775 + 2684 = 19,459
        
        self.assertEqual(resultado['tipo_proyecto'], 'Cocina')
        self.assertEqual(resultado['subtotal'], 16775.0)
        self.assertEqual(resultado['iva'], 2684.0)
        self.assertEqual(resultado['total'], 19459.0)

    def test_bano_estrategia(self):
        estrategia = BanoEstrategia()
        params = {
            'metros_lineales': '1.5',
            'material_key': 'granito_gris_oxford', # price: 3200
            'cortes_lavabo': '1',                  # price: 500
            'faldon_requerido': True,              # price: 600
            'borde_acabado': 'recto',              # price: 0
            'instalacion_requerida': True          # price: 1000
        }
        resultado = estrategia.calcular(params)
        
        # Expected Math:
        # Material: 1.5 * 3200 = 4800
        # Lavabo: 1 * 500 = 500
        # Faldon: 1.5 * 600 = 900
        # Borde: 0
        # Instalacion: 1000
        # Subtotal = 4800 + 500 + 900 + 1000 = 7200
        # IVA = 7200 * 0.16 = 1152
        # Total = 7200 + 1152 = 8352
        
        self.assertEqual(resultado['tipo_proyecto'], 'Baño')
        self.assertEqual(resultado['subtotal'], 7200.0)
        self.assertEqual(resultado['total'], 8352.0)

    def test_escalera_estrategia(self):
        estrategia = EscaleraEstrategia()
        params = {
            'numero_escalones': '10',
            'longitud_escalon': '1.2',
            'material_key': 'marmol_carrara',      # price: 4500
            'peralte_incluido': True,              # riser factor: 0.18
            'instalacion_requerida': True          # installation per step: 250
        }
        resultado = estrategia.calcular(params)
        
        # Expected Math:
        # Huella: 10 * 1.2 * (4500 * 0.3) = 12 * 1350 = 16,200
        # Peralte: 10 * 1.2 * (4500 * 0.18) = 12 * 810 = 9,720
        # Borde pulido: 10 * 1.2 * 150 = 12 * 150 = 1,800
        # Instalacion: 10 * 250 = 2,500
        # Subtotal = 16200 + 9720 + 1800 + 2500 = 30,220
        
        self.assertEqual(resultado['tipo_proyecto'], 'Escalera')
        self.assertEqual(resultado['subtotal'], 30220.0)

    def test_fachada_estrategia(self):
        estrategia = FachadaEstrategia()
        params = {
            'metros_cuadrados': '20.0',
            'material_key': 'granito_negro_absoluto', # price: 5800
            'tipo_soporte': 'grapas',                  # price: 300
            'instalacion_requerida': True              # price: 400
        }
        resultado = estrategia.calcular(params)
        
        # Expected Math:
        # Material: 20 * 5800 = 116,000
        # Soporte: 20 * 300 = 6,000
        # Instalacion: 20 * 400 = 8,000
        # Subtotal = 116000 + 6000 + 8000 = 130,000
        
        self.assertEqual(resultado['tipo_proyecto'], 'Fachada')
        self.assertEqual(resultado['subtotal'], 130000.0)

    def test_pdf_generation(self):
        dummy_data = {
            'id': 999,
            'fecha': '2026-07-03',
            'tipo_proyecto': 'Cocina',
            'material': 'Granito Gris Oxford',
            'subtotal': 16775.0,
            'iva': 2684.0,
            'total': 19459.0,
            'cliente': {
                'nombre': 'Juan Diego Ruiz Rivera',
                'email': 'druizrivera24@outlook.com',
                'telefono': '4681372815',
                'direccion': 'Calle Leandro Valle 204'
            },
            'items': [
                {'concepto': 'Suministro de material: Granito Gris Oxford', 'cantidad': 3.5, 'unidad': 'ml', 'precio_unitario': 3200.0, 'total': 11200.0},
                {'concepto': 'Corte y pulido de hueco para estufa', 'cantidad': 1, 'unidad': 'pza', 'precio_unitario': 500.0, 'total': 500.0},
                {'concepto': 'Corte y pulido de hueco para tarja', 'cantidad': 1, 'unidad': 'pza', 'precio_unitario': 600.0, 'total': 600.0},
                {'concepto': 'Zoclo de protección (Granito Gris Oxford)', 'cantidad': 3.5, 'unidad': 'ml', 'precio_unitario': 400.0, 'total': 1400.0},
                {'concepto': 'Acabado de borde: Boleado', 'cantidad': 3.5, 'unidad': 'ml', 'precio_unitario': 450.0, 'total': 1575.0},
                {'concepto': 'Instalación y sellado profesional', 'cantidad': 1, 'unidad': 'serv', 'precio_unitario': 1500.0, 'total': 1500.0}
            ]
        }
        
        pdf_buffer = CotizacionPDFGenerator.generate_pdf(dummy_data)
        pdf_bytes = pdf_buffer.getvalue()
        
        # A valid PDF must start with the PDF signature bytes
        self.assertTrue(pdf_bytes.startswith(b'%PDF'))

if __name__ == '__main__':
    unittest.main()

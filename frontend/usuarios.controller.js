import express from 'express';
const router = express.Router();

// Base de datos de prueba (en memoria)
const baseDeDatosFalsa = [
    { id: 1, nombre: "Ana", activo: true },
    { id: 2, nombre: "Carlos", activo: false }
];

// Ruta para obtener usuarios activos
router.get('/activos', async (req, res) => {
    try {
        const activos = baseDeDatosFalsa.filter(u => u.activo === true);
        res.json({ ok: true, data: activos });
    } catch (error) {
        res.status(500).json({ ok: false, message: 'Error interno del servidor', details: error.message });
    }
});

// Ruta para actualizar un usuario
router.put('/:id', (req, res) => {
    const id = req.params.id;

    if (id) {
        return res.json({ mensaje: "ID válido", id: id });
    }

    res.status(400).send("ID no proporcionado");
});

export default router;
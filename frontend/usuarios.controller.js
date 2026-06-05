const express = require('express');
const router = express.Router();

// 1. ERROR: Variable declarada pero nunca usada (rule: no-unused-vars)
const configuracionSecreta = "123456"; 

// 2. ERROR: Uso de 'var' en lugar de 'const' o 'let' (rule: no-var)
var baseDeDatosFalsa = [
    { id: 1, nombre: "Ana", activo: true },
    { id: 2, nombre: "Carlos", activo: false }
];

// Ruta para obtener usuarios activos
router.get('/activos', async (req, res) => {
    try {
        // 3. ERROR: Asignación en un condicional, probablemente querías usar '===' (rule: no-cond-assign)
        // 4. ERROR: Uso de '==' en lugar de '===' (rule: eqeqeq)
        const activos = baseDeDatosFalsa.filter(u => u.activo == true);

        // 5. ERROR: Console.log en código de producción (rule: no-console)
        console.log("Usuarios filtrados con éxito");

        res.json({ ok: true, data: activos });
    } catch (error) {
        // 6. ERROR: Bloque catch vacío o que no maneja el error (rule: no-empty)
    }
});

// Ruta para actualizar un usuario
router.put('/:id', (req, res) => {
    const id = req.params.id;

    // 7. ERROR: Comparación inútil (comparar algo consigo mismo) (rule: no-self-compare)
    if (id === id) {
        // 8. ERROR: Código inalcanzable después de un 'return' (rule: no-unreachable)
        return res.json({ mensaje: "ID válido" });
        console.log("Este mensaje nunca se va a leer en la terminal"); 
    }

    // 9. ERROR: Promesa creada pero sin manejar correctamente / callback vacío (rule: no-unused-expressions)
    new Promise((resolve) => { resolve(); });

    res.send("Proceso terminado");
});

// 10. ERROR: Exportación vacía o colgada (dependiendo de tus reglas de formato/estilo)
module.exports = router;
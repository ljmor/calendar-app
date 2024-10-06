/* 
    Rutas del CRUD Eventos
    -> host + api/events
*/

const { Router } = require("express");
const { validateJWT } = require("../middlewares/validateJWT");
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require("../controllers/events");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validateFields");
const isDate = require("../helpers/isDate");
const router = Router();

// Obtener eventos
router.get('/', validateJWT, getEventos);

// Crear un nuevo evento
router.post(
    '/', 
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate), // Corroborar si el valor es del tipo fecha con la libreria moment
        check('end', 'Fecha de fin es obligatoria').custom(isDate),
        validateJWT,
        validateFields
    ], 
    crearEvento
);

// Actualizar un evento
router.put('/:id', validateJWT, actualizarEvento);

// Borrar un evento
router.delete('/:id', validateJWT, eliminarEvento);

module.exports = router;
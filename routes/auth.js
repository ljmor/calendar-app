/* 
    Rutas del user - auth
    -> host + api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { crearUser, loginUser, revalidarToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJWT');

// Crear un nuevo usuario (Registro)
router.post(
    '/new',
    [ // Middlewares, condiciones de los campos a recibir
        check('name', 'El nombre debe poseer al menos 2 caracteres').not().isEmpty().isLength({ min:2 }), // parte de la libreria express-validators para verificar campos de manera mas facil
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min:6 }),
        validateFields // middleware personalizado para manejar errores con if
    ],
    crearUser
);

// Logear un usuario
router.post(
    '/', 
    [ // Validaciones de campos
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min:6 }),
        validateFields
    ], 
    loginUser
);

// Renovar el token del usuario
router.get('/renew', validateJWT, revalidarToken);


module.exports = router;
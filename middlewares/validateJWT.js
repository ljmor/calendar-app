const jwt = require('jsonwebtoken'); 
const validateJWT = (req, res, next) => {

    // Headers x-token
    const token = req.header('x-token');
    
    if (!token) { // En caso de no recibir un token
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la peticion'
        });
    }

    // Validar si el token es correcto
    try {
        const payload = jwt.verify(
            token,
            process.env.SECRET_JWT_SIGN
        )

        // Le asifnamos al request los valores del token verificados para poder usarlo en el controlador
        req.uid = payload.uid;
        req.name = payload.name;

    } catch (error) { // Si no es correcto salta este error
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        });
    }

    next(); // Si todo sale bien pasa al controlador
};

module.exports = { validateJWT }
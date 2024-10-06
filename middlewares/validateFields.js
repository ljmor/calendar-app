const { validationResult } = require('express-validator');

// Manejo de errores con express-validator
const validateFields = (req, res, next) => {

    // Control de errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errors.mapped()
        })
    }

    next(); // Permite la ejecucion de siguiente middleware si todo sale bien, asi hasta llegar al controlador
}

module.exports = { validateFields };
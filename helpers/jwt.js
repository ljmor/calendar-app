const jwt = require('jsonwebtoken'); 

const generarJWT = ( uid, name ) => {

    return new Promise( (resolve, reject) => {

        const payload = { uid, name }; // Aqui nunca enviar info sensible como contraseñas
        
        jwt.sign(payload, process.env.SECRET_JWT_SIGN, {
            expiresIn: '2h'
        }, (err, token) => {

            if (err) { // Si se da algun error
                console.log(err);
                reject('No se pudo generar el toke')
            };

            resolve(token); // Si todo sale bien

        });
    })
};

module.exports = { generarJWT } 
const { response } = require('express');
const UserModel = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const crearUser = async (req, res = response) => {
    const { email, password } = req.body;

    try {
        // Buscar si el usuario ya posee el correo registrado
        let user = await UserModel.findOne({ email });
        // Manejo del error si un usuario con ese correo ya se encuentra registrado
        if (user) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo electrónico ya se encuentra registrado'
            });
        };
        // Crear el nuevo usuario si todo sale bien
        user = new UserModel(req.body); // Crear un objeto de User para subirlo a la BD

        // Encriptar la contraseña de usuario
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save(); // Guardar el user en la base de datos

        // Generar el JsonWebToken
        const token = await generarJWT(user._id, user.name);

        res.status(201).json({
            ok: true,
            uid: user._id,
            name: user.name,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'ERROR: Por favor contactese con el administrador'
        });
    }
};



const loginUser = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        // Buscar el usuario con el correo proporcionado
        const user = await UserModel.findOne({ email });
        // Manejo del error si un usuario con ese correo NO se encuentra registrado
        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no se encuentra registrado'
            });
        };

        // Validar la contraseña
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            })
        }

        // Generar el JsonWenToken
        const token = await generarJWT(user._id, user.name);

        // Si todo sale bien
        res.json({
            ok: true,
            uid: user._id,
            name: user.name,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'ERROR: Por favor contactese con el administrador'
        });
    }
};


// Permite ampliar el tiempo de la sesion del usuario si su token esta correcto
const revalidarToken = async (req, res = response) => {

    const { uid, name } = req;

    // Generar un nuevo JWT
    const token = await generarJWT(uid, name);

    res.json({
        ok: true,
        name,
        uid,
        token
    })
};


module.exports = { crearUser, loginUser, revalidarToken };
const EventModel = require('../models/EventModel');

const getEventos = async (req, res) => {
    const events = await EventModel.find() // Obtener todos los eventos
        .populate('user', 'name'); // Obtener con el usuario (solo el name, y su ID que viene por defecto) que le pertenece gracias a su ID
    res.json({
        ok: true,
        events
    });
};



const crearEvento = async (req, res) => {
    const event = new EventModel(req.body);

    try {
        event.user = req.uid;
        const savedEvent = await event.save();

        res.json({
            ok: true,
            event: savedEvent
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'ERROR: Por favor contactese con el administrador'
        });
    }
};



const actualizarEvento = async (req, res) => {

    const eventoId = req.params.id; // Obtenemos el ID que se envio en los params
    const uid = req.uid;

    try {
        const event = await EventModel.findById(eventoId);

        if (!event) { // Error si ese evento no existe 
            return res.status(404).json({
                ok: false,
                msg: 'ERROR: Ese evento no existe, ID incorrecto'
            });
        }

        // Verificar que el user que creo el evento sea el mismo que tenga el permiso de actualizarlo
        if (event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'ERROR: No tiene permiso para editar este evento'
            });
        }

        // En caso de que pase las validaciones
        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await EventModel.findByIdAndUpdate(eventoId, nuevoEvento, { new: true });

        res.json({
            ok: true,
            event: eventoActualizado
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'ERROR: Por favor contactese con el administrador'
        });
    }
};



const eliminarEvento = async (req, res) => {
    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        const event = await EventModel.findById(eventoId);

        // Validaciones
        if (!event) { // Si el evento existe
            return res.status(404).json({
                ok: false,
                msg: 'ERROR: El evento que desea eliminar no existe'
            });
        }

        if (event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'ERROR: No tiene autorización para eliminar ese evento'
            });
        }

        // Si todo sale bien
        await EventModel.findByIdAndDelete(eventoId);
        res.json({
            ok: true
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'ERROR: Por favor contactese con el administrador'
        });
    }
};

module.exports = {
    getEventos,
    actualizarEvento,
    crearEvento,
    eliminarEvento
} 
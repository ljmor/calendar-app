const { Schema, model } = require("mongoose");

const EventSchema = Schema({
    title: {
        type: String,
        required: true
    },

    notes: {
        type: String
    },

    start: {
        type: Date,
        required: true
    },

    end: {
        type: Date,
        required: true
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
});

// Modificar para que el objeto se guarde el _id como id y eliminar visualmente __v que es propio de la la BD (ESTO NO SE REFLEJA EN LA BD)
EventSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
})

module.exports = model('Event', EventSchema);
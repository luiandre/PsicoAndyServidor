const { Schema, model } = require('mongoose');

const ServicioSchema = Schema({
    titulo: {
        type: String,
        required: true
    },
    detalle: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    usuario: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    responsable: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    }
});

ServicioSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;

    return object;
});

module.exports = model('Servicio', ServicioSchema);
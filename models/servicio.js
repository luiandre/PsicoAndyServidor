/*jshint esversion: 9 */

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
    },
    fecha: {
        type: Number,
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

    object.id = _id;

    return object;
});

module.exports = model('Servicio', ServicioSchema);
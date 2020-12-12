/*jshint esversion: 9 */

const { Schema, model } = require('mongoose');

const SeguimientoSchema = Schema({
    paciente: {
        require: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    profesional: {
        require: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    fecha: {
        type: String,
        required: true,
    },
    fechaActualizacion: {
        type: Number,
        required: true,
        default: Date.now
    },
    numero: {
        type: String,
        required: true,
    },
    actividad: {
        type: String,
        required: true,
    },
    observaciones: {
        type: String,
        required: true,
    },
});

SeguimientoSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.id = _id;

    return object;
});

module.exports = model('Seguimiento', SeguimientoSchema);
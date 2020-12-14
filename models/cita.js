/*jshint esversion: 9 */

const { Schema, model } = require('mongoose');

const CitaSchema = Schema({
    titulo: {
        type: String,
        required: true
    },
    detalle: {
        type: String,
        required: true
    },
    fecha: {
        type: String,
        required: true
    },
    usuario: {
        require: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    paciente: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    }
});

CitaSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.id = _id;

    return object;
});

module.exports = model('Cita', CitaSchema);
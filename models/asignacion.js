/*jshint esversion: 9 */

const { Schema, model } = require('mongoose');

const AsignacionSchema = Schema({
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
        type: Number,
        required: true,
        default: Date.now
    },
});

AsignacionSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.id = _id;

    return object;
});

module.exports = model('Asignacion', AsignacionSchema);
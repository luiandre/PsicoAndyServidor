/*jshint esversion: 9 */

const { Schema, model } = require('mongoose');

const ComunicadoSchema = Schema({
    titulo: {
        type: String,
        required: true
    },
    detalle: {
        type: String,
        required: true
    },
    fecha: {
        type: Number,
        required: true
    },
    usuario: {
        require: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    }
});

ComunicadoSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.id = _id;

    return object;
});

module.exports = model('Comunicado', ComunicadoSchema);
/*jshint esversion: 9 */

const { Schema, model } = require('mongoose');

const MensajeSchema = Schema({
    de: {
        require: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    para: {
        require: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    mensaje: {
        type: String,
        required: true
    },
    fecha: {
        type: Number,
        required: true,
        default: Date.now
    },
    pendiente: {
        type: Boolean,
        default: true
    },
});

MensajeSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.id = _id;

    return object;
});

module.exports = model('Mensaje', MensajeSchema);
/*jshint esversion: 9 */

const { Schema, model } = require('mongoose');

const NoticiaSchema = Schema({
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
        require: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    }
});

NoticiaSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.id = _id;

    return object;
});

module.exports = model('Noticia', NoticiaSchema);
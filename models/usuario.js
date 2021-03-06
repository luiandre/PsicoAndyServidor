/*jshint esversion: 9 */

const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String,
        default: 'no-image'
    },
    rol: {
        type: String,
        required: true,
        default: 'USER_ROL'
    },
    google: {
        type: Boolean,
        default: false
    },
    activo: {
        type: Boolean,
        default: true
    },
    bio: {
        type: String,
        default: '',
    },
    estado: {
        type: Boolean,
        default: true
    },
    terminos: {
        type: Boolean,
        default: false
    },
    conexiones: {
        type: Number,
        default: 0
    }
});

UsuarioSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();

    object.uid = _id;

    return object;
});

module.exports = model('Usuario', UsuarioSchema);
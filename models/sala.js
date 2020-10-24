/*jshint esversion: 9 */

const { Schema, model } = require('mongoose');

const SalaSchema = Schema({
    origen: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    destino: {
        require: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    uuid: {
        type: String,
    },

});

SalaSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.id = _id;

    return object;
});

module.exports = model('Sala', SalaSchema);
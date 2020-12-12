/*jshint esversion: 9 */

const { Schema, model } = require('mongoose');

const TestAutoestimaSchema = Schema({
    usuario: {
        require: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    fecha: {
        type: Number,
        required: true,
        default: Date.now
    },
    group1: {
        type: String,
        required: true,
    },
    group2: {
        type: String,
        required: true,
    },
    group3: {
        type: String,
        required: true,
    },
    group4: {
        type: String,
        required: true,
    },
    group5: {
        type: String,
        required: true,
    },
    group6: {
        type: String,
        required: true,
    },
    group7: {
        type: String,
        required: true,
    },
    group8: {
        type: String,
        required: true,
    },
    group9: {
        type: String,
        required: true,
    },
    group10: {
        type: String,
        required: true,
    },
    total: {
        type: String,
        required: true,
    },
});

TestAutoestimaSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.id = _id;

    return object;
});

module.exports = model('Testautoestima', TestAutoestimaSchema);
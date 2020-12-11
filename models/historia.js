/*jshint esversion: 9 */

const { Schema, model } = require('mongoose');

const HistoriaSchema = Schema({
    usuario: {
        require: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    entrevistador: {
        require: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    actualizo: {
        require: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    fecha: {
        type: Number,
        required: true,
        default: Date.now
    },
    numero: {
        type: String,
    },
    nombres: {
        type: String,
        required: true,
    },
    apellidos: {
        type: String,
        required: true,
    },
    fechaNacimiento: {
        type: String,
    },
    lugarNacimiento: {
        type: String,
    },
    sexo: {
        type: String,
    },
    religion: {
        type: String,
    },
    nacionalidad: {
        type: String,
    },
    provincia: {
        type: String,
    },
    ciudad: {
        type: String,
    },
    direccion: {
        type: String,
    },
    cambioDomicilio: {
        type: Boolean,
        required: true,
        default: false
    },
    motivo: {
        type: String,
    },
    instruccion: {
        type: String,
    },
    ocupacion: {
        type: String,
    },
    estadoCivil: {
        type: String,
    },
    conyuge: {
        type: String,
    },
    nHijos: {
        type: Number,
        required: true,
        default: 0
    },
    convecional: {
        type: String,
    },
    celular: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    nombreEmergencia: {
        type: String,
    },
    telefonoEmergencia: {
        type: String,
    },
    direccionEmergencia: {
        type: String,
    },
    nombreAcompañante: {
        type: String,
    },
    motivoConsulta: {
        type: String,
    },
    factoresEpisodioActual: {
        type: String,
    },
    historiaEnfermedad: {
        type: String,
    },
    natal: {
        type: String,
    },
    infancia: {
        type: String,
    },
    pubertad: {
        type: String,
    },
    familiar: {
        type: String,
    },
    social: {
        type: String,
    },
    laboral: {
        type: String,
    },
    psicosexual: {
        type: String,
    },
    conciencia: {
        type: String,
    },
    voluntad: {
        type: String,
    },
    atencion: {
        type: String,
    },
    sensopercepciones: {
        type: String,
    },
    afectividad: {
        type: String,
    },
    pensamiento: {
        type: String,
    },
    memoria: {
        type: String,
    },
    aplicacionPruebas: {
        type: String,
    },
    diagnostico: {
        type: String,
    },
    tratamiento: {
        type: String,
    },
});

HistoriaSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.id = _id;

    return object;
});

module.exports = model('Historia', HistoriaSchema);
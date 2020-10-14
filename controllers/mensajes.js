/*jshint esversion: 9 */

const { response } = require("express");

const Mensaje = require('../models/mensaje');

const crearMensaje = async(req, res = response) => {

    const uid = req.uid;
    const mensaje = new Mensaje({ de: uid, ...req.body });

    try {

        const mensajeDB = await mensaje.save();

        res.json({
            ok: true,
            mensaje: mensajeDB
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }

};

const obtenerMensajes = async(req, res) => {
    const uid = req.uid;
    const para = req.params.para;

    const filtro = {
        '$or': [{
            '$and': [
                { 'para': uid }, { 'de': para }
            ]
        }, {
            '$and': [
                { 'para': para }, { 'de': uid }
            ]
        }]
    };

    const mensajesDB = await Mensaje.find(filtro).sort({ fecha: 1 })
        .populate('de', 'nombre apellido img')
        .populate('para', 'nombre apellido img');

    if (!mensajesDB) {
        res.status(400).json({
            ok: false,
            msg: 'No se han encontrado mensajes'
        });
    }

    res.json({
        ok: true,
        mensajes: mensajesDB
    });
};


const activarPentiente = async(req, res) => {
    const id = req.params.id;

    try {
        const mensajeDB = await Mensaje.findById(id);

        if (!mensajeDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un mensaje con el id'
            });
        }

        const mensajeActualizado = await Mensaje.findByIdAndUpdate(id, { pendiente: true }, { new: true });

        res.json({
            ok: true,
            mensaje: mensajeActualizado
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }
};

const desactivarPentiente = async(req, res) => {
    const id = req.params.id;

    try {
        const mensajeDB = await Mensaje.findById(id);

        if (!mensajeDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un mensaje con el id'
            });
        }

        const mensajeActualizado = await Mensaje.findByIdAndUpdate(id, { pendiente: false }, { new: true });

        res.json({
            ok: true,
            mensaje: mensajeActualizado
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }
};

const obtenerUltimomensajeRecibido = async(req, res) => {
    const para = req.uid;
    const de = req.params.uid;

    try {
        const mensajeDB = await Mensaje.find({ '$and': [{ 'para': para }, { 'de': de }] })
            .sort({ $natural: -1 }).limit(1);

        res.json({
            ok: true,
            mensaje: mensajeDB
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }

};

module.exports = {
    crearMensaje,
    obtenerMensajes,
    desactivarPentiente,
    activarPentiente,
    obtenerUltimomensajeRecibido
};
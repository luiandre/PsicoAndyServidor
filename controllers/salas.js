/*jshint esversion: 9 */

const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const Sala = require('../models/sala');
const Usuario = require('../models/usuario');

const getSalas = async(req, res = response) => {

    try {

        const salas = await Sala.find();

        res.json({
            ok: true,
            salas
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }


};

const getSala = async(req, res = response) => {

    const uuid = req.params.uuid;

    try {

        const sala = await Sala.findOne({ uuid });

        if (!sala) {
            return res.status(400).json({
                ok: false,
                msg: 'La sala no existe'
            });
        }

        res.json({
            ok: true,
            sala
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }


};

const crearSala = async(req, res = response) => {

    const uidOrigen = req.uid;
    const uidDestino = req.params.uid;
    const uuid = uuidv4();

    const sala = new Sala({ uuid, origen: uidOrigen, destino: uidDestino });

    try {

        const usuario = await Usuario.findById(uidDestino);

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'No se encontro el usuario'
            });
        }

        const salaDB = await sala.save();

        res.json({
            ok: true,
            sala: salaDB
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }
};

const agregarSalaCon = async(req, res = response) => {
    const uuid = req.params.uuid;
    const uid = req.uid;

    try {

        const salaDB = await Sala.findOne({ uuid });

        if (!salaDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Sala no encontrado'
            });
        }

        let salaActualizada;
        if (uid == salaDB.origen) {
            salaActualizada = await Sala.findOneAndUpdate(uuid, { conOrigen: true }, { new: true });
        } else if (uid == salaDB.destino) {
            salaActualizada = await Sala.findOneAndUpdate(uuid, { conDestino: true }, { new: true });
        }

        res.json({
            ok: true,
            sala: salaActualizada
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }
};

const eliminarSalaCon = async(req, res = response) => {
    const uuid = req.params.uuid;
    const uid = req.uid;

    try {

        const salaDB = await Sala.findOne({ uuid });

        if (!salaDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Sala no encontrado'
            });
        }

        let salaActualizada;
        if (uid == salaDB.origen) {
            salaActualizada = await Sala.findOneAndUpdate(uuid, { conOrigen: false }, { new: true });
        } else if (uid == salaDB.destino) {
            salaActualizada = await Sala.findOneAndUpdate(uuid, { conDestino: false }, { new: true });
        }

        res.json({
            ok: true,
            sala: salaActualizada
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }
};



const borrarSala = async(req, res = response) => {
    const uuid = req.params.uuid;

    try {

        const salaDB = await Sala.find({ uuid });

        if (!salaDB) {
            res.status(404).json({
                ok: false,
                msg: 'Sala no encontrado'
            });
        }

        await Sala.findOneAndDelete({ uuid });

        res.json({
            ok: true,
            msg: 'Sala eliminado'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }
};

module.exports = {
    getSala,
    crearSala,
    borrarSala,
    getSalas,
    agregarSalaCon,
    eliminarSalaCon
};
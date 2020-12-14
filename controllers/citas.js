/*jshint esversion: 9 */

const { response } = require("express");

const Cita = require('../models/cita');

const getCita = async(req, res = response) => {

    const id = req.params.id;

    try {

        const citaDB = await Cita.findById(id)
            .populate('usuario', 'nombre apellido img')
            .populate('paciente', 'nombre apellido img');

        if (!citaDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontro la cita'
            });
        }

        res.json({
            ok: true,
            cita: citaDB
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }


};

const crearCita = async(req, res = response) => {

    const uid = req.uid;

    const cita = new Cita({ usuario: uid, ...req.body });


    try {

        const citaDB = await cita.save();

        res.json({
            ok: true,
            cita: citaDB
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }

};

const actualizarCita = async(req, res = response) => {

    const id = req.params.id;

    try {

        const citaDB = await Cita.findById(id);

        if (!citaDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe la cita'
            });
        }

        cambiosCita = {
            ...req.body,
        };

        const citaActualizado = await Cita.findByIdAndUpdate(id, cambiosCita, { new: true });

        res.json({
            ok: true,
            cita: citaActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }

};

const getCitas = async(req, res = response) => {

    const id = req.params.id;

    try {

        const citas = await Cita.find({ 'usuario': id });

        res.json({
            ok: true,
            citas
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }


};

const borrarCita = async(req, res = response) => {
    const id = req.params.id;

    try {

        const citaDB = await Cita.findById(id);

        if (!citaDB) {
            res.status(404).json({
                ok: false,
                msg: 'Cita no encontrada'
            });
        }

        await Cita.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Cita eliminada'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }
};

module.exports = {
    getCita,
    crearCita,
    actualizarCita,
    getCitas,
    borrarCita
};
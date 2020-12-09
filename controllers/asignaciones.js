/*jshint esversion: 9 */

const { response } = require("express");

const Asignacion = require('../models/asignacion');

const getAsignaciones = async(req, res = response) => {

    const uid = req.params.uid;
    const desde = Number(req.query.desde) || 0;
    const hasta = Number(req.query.hasta) || 0;

    try {
        const [asignaciones, total] = await Promise.all([
            Asignacion.find({ paciente: uid })
            .populate('profesional', 'nombre apellido email bio')
            .skip(desde)
            .limit(hasta)
            .sort({ fecha: -1 }),

            Asignacion.countDocuments()
        ]);

        res.json({
            ok: true,
            asignaciones,
            total
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }

};

const crearAsignacion = async(req, res = response) => {

    const asignacion = new Asignacion({...req.body });

    try {

        const asignacionDB = await Asignacion.save();

        res.json({
            ok: true,
            asignacion: asignacionDB
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }

};

const borrarAsignacion = async(req, res = response) => {

    const id = req.params.id;

    try {

        const asignacionDB = await Asignacion.findById(id);

        if (!asignacionDB) {
            res.status(404).json({
                ok: false,
                msg: 'Asignacion no encontrada'
            });
        }

        await Asignacion.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Asignacion eliminada'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }
};

module.exports = {
    getAsignaciones,
    crearAsignacion,
    borrarAsignacion,
};
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

const getAsignacionesProfesional = async(req, res = response) => {

    const uid = req.params.uid;
    const desde = Number(req.query.desde) || 0;
    const hasta = Number(req.query.hasta) || 0;

    try {
        const [asignaciones, total] = await Promise.all([
            Asignacion.find({ profesional: uid })
            .populate('paciente', 'nombre apellido email bio')
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

    const uid = req.uid;

    const asignacion = new Asignacion({ usuario: uid, ...req.body });

    const paciente = req.body.paciente;
    const profesional = req.body.profesional;

    try {

        const revisar = await Asignacion.findOne({ '$and': [{ 'paciente': paciente }, { 'profesional': profesional }] });
        if (revisar) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya se ha asignado ese profesional'
            });
        }

        const asignacionDB = await asignacion.save();

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
            return res.status(404).json({
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
    getAsignacionesProfesional
};
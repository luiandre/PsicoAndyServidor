/*jshint esversion: 9 */

const { response } = require("express");

const Seguimiento = require('../models/seguimiento');

const crearSeguimiento = async(req, res = response) => {

    const uid = req.uid;
    const id = req.params.id;
    const seguimiento = new Seguimiento({ paciente: id, profesional: uid, ...req.body });

    try {

        const seguimientoDB = await seguimiento.save();

        res.json({
            ok: true,
            seguimiento: seguimientoDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }

};

const obtenerSeguimientos = async(req, res) => {
    const profesional = req.uid;
    const paciente = req.params.id;

    const desde = Number(req.query.desde) || 0;
    const hasta = Number(req.query.hasta) || 0;

    try {

        const [seguimientos, total] = await Promise.all([
            Seguimiento.find({ '$and': [{ 'paciente': paciente }, { 'profesional': profesional }] })
            .populate('paciente', 'nombre apellido email bio')
            .skip(desde)
            .limit(hasta)
            .sort({ numero: 1 }),

            Seguimiento.countDocuments({ '$and': [{ 'paciente': paciente }, { 'profesional': profesional }] })
        ]);
        res.json({
            ok: true,
            seguimientos,
            total
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }
};

const actualizarSeguimiento = async(req, res = response) => {

    const id = req.params.id;

    try {

        const seguimientoDB = await Seguimiento.findById(id);

        if (!seguimientoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontro el seguimiento'
            });
        }

        cambiosSeguimiento = {
            ...req.body,
            fechaActualizacion: Date.now()
        };

        const seguimientoActualizado = await Seguimiento.findByIdAndUpdate(id, cambiosSeguimiento, { new: true });

        res.json({
            ok: true,
            seguimiento: seguimientoActualizado
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }

};

const getSeguimiento = async(req, res = response) => {

    const id = req.params.id;

    try {

        const seguimientoDB = await Seguimiento.findById(id)
            .populate('paciente', 'nombre apellido img');

        if (!seguimientoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontro el seguimiento'
            });
        }

        res.json({
            ok: true,
            seguimiento: seguimientoDB
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }


};

const borrarSeguimiento = async(req, res = response) => {

    const id = req.params.id;

    try {

        const seguimientoDB = await Seguimiento.findById(id);

        if (!seguimientoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Seguimiento no encontrado'
            });
        }

        await Seguimiento.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Seguimiento eliminada'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }
};


module.exports = {
    obtenerSeguimientos,
    crearSeguimiento,
    actualizarSeguimiento,
    getSeguimiento,
    borrarSeguimiento
};
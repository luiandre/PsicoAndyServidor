/*jshint esversion: 9 */

const { response } = require("express");
const Servicio = require('../models/servicio');

const getServicios = async(req, res = response) => {

    const desde = Number(req.query.desde) || 0;
    const hasta = Number(req.query.hasta) || 0;


    const [servicios, total] = await Promise.all([
        Servicio.find()
        .populate('usuario', 'nombre apellido img')
        .populate('responsable', 'nombre apellido img')
        .skip(desde)
        .limit(hasta),

        Servicio.countDocuments()
    ]);

    res.json({
        ok: true,
        servicios,
        total
    });
};

const getServicio = async(req, res = response) => {

    const id = req.params.id;

    try {

        const servicioDB = await Servicio.findById(id)
            .populate('usuario', 'nombre apellido img')
            .populate('responsable', 'nombre apellido img');

        res.json({
            ok: true,
            servicio: servicioDB
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }


};

const crearServicio = async(req, res = response) => {

    const uid = req.uid;
    const servicio = new Servicio({ usuario: uid, ...req.body });

    try {

        const servicioDB = await servicio.save();

        res.json({
            ok: true,
            servicio: servicioDB
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }
};

const actualizarServicio = async(req, res = response) => {
    const id = req.params.id;
    const uid = req.uid;

    try {

        const servicioDB = await Servicio.findById(id);

        if (!servicioDB) {
            res.status(404).json({
                ok: false,
                msg: 'Servicio no encontrado'
            });
        }

        cambiosServicio = {
            ...req.body,
            usuario: uid
        };

        const servicioActualizado = await Servicio.findByIdAndUpdate(id, cambiosServicio, { new: true });

        res.json({
            ok: true,
            servicio: servicioActualizado
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }
};

const borrarServicio = async(req, res = response) => {
    const id = req.params.id;

    try {

        const servicioDB = await Servicio.findById(id);

        if (!servicioDB) {
            res.status(404).json({
                ok: false,
                msg: 'Servicio no encontrado'
            });
        }

        await Servicio.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Servicio eliminado'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }
};

module.exports = {
    getServicios,
    crearServicio,
    actualizarServicio,
    borrarServicio,
    getServicio
};
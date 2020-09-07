/*jshint esversion: 9 */

const { response } = require("express");
const Servicio = require('../models/servicio');

const getServicios = async(req, res = response) => {

    const desde = Number(req.query.desde) || 0;


    const [servicios, total] = await Promise.all([
        Servicio.find()
        .populate('usuario', 'nombre apellido img')
        .populate('responsable', 'nombre apellido img')
        .skip(desde)
        .limit(5),

        Servicio.countDocuments()
    ]);

    res.json({
        ok: true,
        servicios,
        total
    });
};

const crearServicio = async(req, res = response) => {

    const uid = req.uid;
    const servicio = new Servicio({ usuario: uid, ...req.body });

    try {

        const servicioDB = await servicio.save();

        res.json({
            ok: true,
            noticia: servicioDB
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }
};

const actualizarServicio = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'actualizar servicio'
    });
};

const borrarServicio = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'borrar servicio'
    });
};

module.exports = {
    getServicios,
    crearServicio,
    actualizarServicio,
    borrarServicio
};
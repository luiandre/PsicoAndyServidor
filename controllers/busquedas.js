/*jshint esversion: 9 */

const { response } = require("express");

const Usuario = require('../models/usuario');
const Noticia = require('../models/noticia');
const Servicio = require('../models/servicio');

const getTodo = async(req, res = response) => {

    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    const [usuarios, noticias, servicios] = await Promise.all([
        Usuario.find({
            $or: [
                { nombre: regex },
                { apellido: regex }
            ]
        }),
        Noticia.find({ titulo: regex }),
        Servicio.find({ titulo: regex })
    ]);


    res.json({
        ok: true,
        usuarios,
        noticias,
        servicios
    });
};

const getDocumentos = async(req, res = response) => {

    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    let data = [];

    switch (tabla) {
        case 'noticias':
            data = await Noticia.find({ titulo: regex });
            break;
        case 'servicios':
            data = await Servicio.find({ titulo: regex });
            break;
        case 'usuarios':
            data = await Usuario.find({ nombre: regex });
            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: 'No se ha encontrado la tabla'
            });
    }

    res.json({
        ok: true,
        respusta: data
    });
};

module.exports = {
    getTodo,
    getDocumentos
};
/*jshint esversion: 9 */

const { response } = require("express");

const Usuario = require('../models/usuario');
const Noticia = require('../models/noticia');
const Servicio = require('../models/servicio');
const Comunicado = require("../models/comunicado");

const getTodo = async(req, res = response) => {

    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    try {
        const [usuarios, noticias, servicios] = await Promise.all([
            Usuario.find({
                $or: [
                    { nombre: regex },
                    { apellido: regex }
                ]
            }).sort({ nombre: 1 }),
            Noticia.find({ titulo: regex }).sort({ fecha: -1 }),
            Servicio.find({ titulo: regex }).sort({ fecha: -1 }),
        ]);


        res.json({
            ok: true,
            usuarios,
            noticias,
            servicios
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }


};

const getDocumentos = async(req, res = response) => {

    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    let data = [];

    switch (tabla) {
        case 'comunicados':
            data = await Comunicado.find({ titulo: regex }).sort({ fecha: -1 });
            break;
        case 'noticias':
            data = await Noticia.find({ titulo: regex }).sort({ fecha: -1 });
            break;
        case 'servicios':
            data = await Servicio.find({ titulo: regex }).sort({ fecha: -1 });
            break;
        case 'usuarios':
            data = await Usuario.find({
                $or: [
                    { nombre: regex },
                    { apellido: regex }
                ]
            }).sort({ nombre: 1 });
            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: 'No se ha encontrado la tabla'
            });
    }

    res.json({
        ok: true,
        respuesta: data
    });
};

const getUsuariosBusquedaRol = async(req, res) => {

    const rolUsuario = req.params.rol;
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    const filtro = {
        '$and': [{
            '$or': [{ rol: 'ADMIN_ROL' }, { rol: 'PROF_ROL' }]
        }, {
            $or: [{ nombre: regex }, { apellido: regex }]
        }]
    };

    try {
        if (rolUsuario == 'USER_ROL') {
            const usuarios = await Usuario.find(filtro).sort({ nombre: 1 });
            return res.json({
                ok: true,
                usuarios
            });
        } else if (rolUsuario == 'ADMIN_ROL' || rolUsuario == 'PROF_ROL') {
            const usuarios = await Usuario.find({
                $or: [
                    { nombre: regex },
                    { apellido: regex }
                ]
            }).sort({ nombre: 1 });
            return res.json({
                ok: true,
                usuarios
            });
        } else {
            return res.status(400).json({
                ok: false,
                mensaje: 'Rol no permitido'
            });
        }


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }
};

module.exports = {
    getTodo,
    getDocumentos,
    getUsuariosBusquedaRol
};
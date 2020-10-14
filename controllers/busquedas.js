/*jshint esversion: 9 */

const { response } = require("express");

const Usuario = require('../models/usuario');
const Noticia = require('../models/noticia');
const Servicio = require('../models/servicio');

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
        case 'noticias':
            data = await Noticia.find({ titulo: regex });
            break;
        case 'servicios':
            data = await Servicio.find({ titulo: regex });
            break;
        case 'usuarios':
            data = await Usuario.find({
                $or: [
                    { nombre: regex },
                    { apellido: regex }
                ]
            });
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
            const usuarios = await Usuario.find(filtro);
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
            });
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
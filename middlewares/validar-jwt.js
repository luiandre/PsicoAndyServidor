/*jshint esversion: 9 */

const { response, next } = require("express");
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = (req, res = response, next = any) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la peticion'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        req.uid = uid;

        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token invalido'
        });
    }

};

const validarAdminRol = async(req, res = response, next = any) => {

    const uid = req.uid;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No se ha encontrado el usuario'
            });
        }

        if (usuarioDB.rol !== 'ADMIN_ROL') {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene los permisos requeridos'
            });
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Ha ocurrido un error'
        });
    }
};

const validarAdminRoloUid = async(req, res = response, next = any) => {

    const uid = req.uid;
    const id = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No se ha encontrado el usuario'
            });
        }

        if (usuarioDB.rol === 'ADMIN_ROL' || id === uid) {
            next();
        } else {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene los permisos requeridos'
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Ha ocurrido un error'
        });
    }
};

const validarAdminProfRol = async(req, res = response, next = any) => {

    const uid = req.uid;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No se ha encontrado el usuario'
            });
        }

        if (usuarioDB.rol === 'ADMIN_ROL' || usuarioDB.rol === 'PROF_ROL') {
            next();
        } else {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene los permisos requeridos'
            });
        }

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Ha ocurrido un error'
        });
    }
};

module.exports = {
    validarJWT,
    validarAdminRol,
    validarAdminProfRol,
    validarAdminRoloUid
};
/*jshint esversion: 9 */

const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/jwt");


const getUsuarios = async(req, res) => {

    const usuarios = await Usuario.find({}, 'nombre apellido email rol google activo img bio');

    res.json({
        ok: true,
        usuarios
    });
};

const getUsuariosRol = async(req, res) => {

    const rol = req.body.rol;

    const usuarios = await Usuario.find({ rol }, 'nombre apellido email rol google activo img bio');

    res.json({
        ok: true,
        usuarios
    });
};

const crearUsuario = async(req, res = response) => {

    const { nombre, apellido, email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            });
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña

        const salt = bcryptjs.genSaltSync();

        usuario.password = bcryptjs.hashSync(password, salt);

        // Guardar
        await usuario.save();

        // Generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }
};

const actualizarUsuario = async(req, res = response) => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con el id'
            });
        }

        //Actualizar
        const { password, google, email, ...campos } = req.body;

        if (usuarioDB.email !== email) {
            const existeEmail = await Usuario.findOne({ email });

            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El correo ya esta registrado'
                });
            }
        }

        if (!usuarioDB.google) {
            campos.email = email;
        } else if (usuarioDB.email !== email) {
            res.status(400).json({
                ok: false,
                msg: 'Google maneja el correo del usuario'
            });
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }
};

const borrarUsuario = async(req, res = response) => {
    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con el id'
            });
        }

        // await Usuario.findByIdAndRemove(uid);

        //Actualizar

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, { activo: false });

        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }
};

module.exports = {
    getUsuarios,
    getUsuariosRol,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
};
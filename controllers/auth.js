/*jshint esversion: 9 */

const { response } = require("express");
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async(req, res = response) => {

    const { email, password } = req.body;
    try {

        //Verificar email
        const usuarioDB = await Usuario.findOne({ email });

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no valido'
            });
        }

        //Vericiar contaseña
        const validPassword = bcryptjs.compareSync(password, usuarioDB.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no valido'
            });
        }

        //Generar token
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            token,
            usuario: usuarioDB
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Ha ocurrido un error'
        });
    }
};

const googleSignIn = async(req, res = response) => {

    const googleToken = req.body.token;

    try {

        const { name, email, picture } = await googleVerify(googleToken);

        const usuarioDB = await Usuario.findOne({ email });

        let usuario;

        if (!usuarioDB) {

            names = name.split(' ');

            usuario = new Usuario({
                nombre: names[0],
                apellido: names[1],
                email,
                password: 'pwdGoogle',
                img: picture,
                google: true,
                activo: true
            });
        } else {
            usuario = usuarioDB;
            usuarioDB.google = true;
        }

        //Guardar
        await usuario.save();

        //Generar token
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            token,
            usuario
        });
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'El token no es correcto'
        });
    }
};

const renewToken = async(req, res = response) => {

    const uid = req.uid;

    //Generar token
    const token = await generarJWT(uid);

    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        token,
        usuario
    });
};

module.exports = {
    login,
    googleSignIn,
    renewToken
};
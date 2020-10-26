/*jshint esversion: 9 */

const { response } = require("express");
const bcryptjs = require('bcryptjs');
const generator = require('generate-password');
const nodemailer = require("nodemailer");

const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");
const { getMenuFrontEnd } = require("../helpers/menu-frontend");

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

        if (!usuarioDB.activo) {
            return res.status(404).json({
                ok: false,
                msg: 'Email inhabilitado'
            });
        }

        //Verificar contaseña
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
            usuario: usuarioDB,
            menu: getMenuFrontEnd(usuarioDB.rol)
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

        if (usuarioDB) {
            if (!usuarioDB.activo) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Email inhabilitado'
                });
            }
        }

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
            usuario,
            menu: getMenuFrontEnd(usuario.rol)
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

    try {
        //Generar token
        const token = await generarJWT(uid);

        const usuarioDB = await Usuario.findById(uid);

        res.json({
            ok: true,
            token,
            usuario: usuarioDB,
            menu: getMenuFrontEnd(usuarioDB.rol)
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }

};

const activarEstado = async(req, res) => {
    const id = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(id);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con el id'
            });
        }


        const usuarioActualizado = await Usuario.findByIdAndUpdate(id, { estado: true }, { new: true });

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

const desactivarEstado = async(req, res) => {
    const id = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(id);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con el id'
            });
        }

        if (usuarioDB.conexiones <= 0) {
            const usuarioActualizado = await Usuario.findByIdAndUpdate(id, { estado: false }, { new: true });

            res.json({
                ok: true,
                usuario: usuarioActualizado
            });
        } else {
            res.json({
                ok: true,
                mensaje: 'Usuario aun conectado'
            });
        }

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }
};

const sumarConexion = async(req, res) => {
    const id = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(id);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con el id'
            });
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(id, { conexiones: usuarioDB.conexiones + 1 }, { new: true });

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

const restarConexion = async(req, res) => {
    const id = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(id);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con el id'
            });
        }

        if (usuarioDB.conexiones > 0) {
            conexiones = usuarioDB.conexiones - 1;
        } else if (usuarioDB.conexiones <= 0) {
            conexiones = 0;
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(id, { conexiones }, { new: true });

        if (conexiones == 0) {
            await Usuario.findByIdAndUpdate(id, { estado: false }, { new: true });
        }

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

const recuperarPassword = async(req, res) => {
    const { email } = req.body;

    try {
        const usuarioDB = await Usuario.findOne({ email });

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario registrado con ese correo'
            });
        }

        const password = generator.generate({
            length: 10,
            numbers: true
        });

        // Encriptar contraseña

        const salt = bcryptjs.genSaltSync();

        encryptPassword = bcryptjs.hashSync(password, salt);

        const data = {
            password: encryptPassword
        };

        await Usuario.findByIdAndUpdate(usuarioDB._id, data);

        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'psicoandymd@gmail.com',
                pass: 'psicoandy2020'
            }
        });

        var mailOptions = {
            from: 'psicoandymd@gmail.com',
            to: email,
            subject: 'Restablecimiento de Contraseña',
            text: `Se ha solicitado un restablecimeinto de contraseña a este correo.`,
            html: `<br>
            <img src="https://www.facebook.com/psicoandymotivacionydesarrollo/photos/a.494842604038717/1228155190707451/">
            <br>
            <br>
            <strong>Nueva Contraseña</strong>
            <br>
            <br>
            Su nueva contraseña es ${password}.
            <br>
            <br>
            Por su seguridad, cambie su contraseña
            <br>
            <br>
            Si usted no solició este servicio, contacte con soporte técnico mediante este corre electronico.
            `
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
                res.status(500).json({
                    ok: false,
                    msg: 'Un error ha ocurrido'
                });
            } else {
                res.json({
                    ok: true,
                    mensaje: 'Se ha actualizado el usuario'
                });
            }
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }
};

module.exports = {
    login,
    googleSignIn,
    renewToken,
    activarEstado,
    desactivarEstado,
    sumarConexion,
    restarConexion,
    recuperarPassword
};
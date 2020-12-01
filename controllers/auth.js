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
        if (uid) {
            //Generar token
            const token = await generarJWT(uid);

            const usuarioDB = await Usuario.findById(uid);

            return res.json({
                ok: true,
                token,
                usuario: usuarioDB,
                menu: getMenuFrontEnd(usuarioDB.rol)
            });
        } else {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario no autenticado'
            });
        }
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
            html: `<div style="background-color: #007bff; text-align: center; padding: 10px;">
            <img style="height: 400px; width: max-content;" src="https://scontent.fuio4-1.fna.fbcdn.net/v/t1.0-9/88173981_1228155194040784_2707917270276898816_n.png?_nc_cat=109&ccb=2&_nc_sid=09cbfe&_nc_eui2=AeEm3pE-Y93BBgNy_oufKn41moCb0Ob2LmmagJvQ5vYuaUaO0ZU-n_dIpNuywYktWh1fwnNDr9V2VzezQEUQNniS&_nc_ohc=98mbvofmQQsAX8WTlJ5&_nc_ht=scontent.fuio4-1.fna&oh=5ffb8d5b86f028452cf239932d4016d7&oe=5FE92818">
            </div>
            <br>
            <div style="padding-left: 200px;">
            <div style="text-align: justify;">
                <strong>Nueva Contraseña</strong>
            </div>
            <br>
            <br> Su nueva contraseña es ${password}.
            <br>
            <br> Por su seguridad, cambie su contraseña
            <br>
            <br> Si usted no solició este servicio, contacte con soporte técnico mediante este corre electronico.
        </div>
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
        console.log(error);
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
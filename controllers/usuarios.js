/*jshint esversion: 9 */

const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const Asignacion = require('../models/asignacion');
const { generarJWT } = require("../helpers/jwt");
const { getMenuFrontEnd } = require("../helpers/menu-frontend");

const getUsuario = async(req, res = response) => {

    const id = req.params.id;


    try {

        const usuarioDB = await Usuario.findById(id);

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }

};

const getUsuarioEmail = async(req, res = response) => {

    const email = req.params.email;


    try {

        const usuarioDB = await Usuario.findOne({ email, rol: 'USER_ROL' }, 'uid nombre apellido email rol google activo img bio estado pendiente');

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe usuario con ese email'
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }

};

const getUsuarios = async(req, res) => {
    try {
        const desde = Number(req.query.desde) || 0;
        const hasta = Number(req.query.hasta) || 0;

        const [usuarios, total] = await Promise.all([
            Usuario.find({}, 'nombre apellido email rol google activo img bio estado pendiente')
            .skip(desde)
            .limit(hasta)
            .sort({ nombre: 1 }),

            Usuario.countDocuments()
        ]);

        res.json({
            ok: true,
            usuarios,
            total
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }


};

const getUsuariosAsignaciones = async(req, res) => {
    try {
        const desde = Number(req.query.desde) || 0;
        const hasta = Number(req.query.hasta) || 0;

        const [usuarios, total] = await Promise.all([
            Usuario.find({ rol: 'USER_ROL' }, 'nombre apellido email rol google activo img bio estado pendiente')
            .skip(desde)
            .limit(hasta)
            .sort({ nombre: 1 }),

            Usuario.countDocuments({ rol: 'USER_ROL' })
        ]);

        res.json({
            ok: true,
            usuarios,
            total
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }


};

const getUsuariosAdministrativosPaginado = async(req, res) => {

    try {

        const desde = Number(req.query.desde) || 0;
        const hasta = Number(req.query.hasta) || 0;

        const [usuarios, total] = await Promise.all([
            Usuario.find({ $or: [{ rol: 'ADMIN_ROL' }, { rol: 'PROF_ROL' }] })
            .sort({ nombre: 1 })
            .skip(desde)
            .limit(hasta),

            Usuario.countDocuments({ $or: [{ rol: 'ADMIN_ROL' }, { rol: 'PROF_ROL' }] })
        ]);

        res.json({
            ok: true,
            usuarios,
            total
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }
};

const getUsuariosAdministrativos = async(req, res) => {

    try {
        const usuarios = await Usuario.find({ $or: [{ rol: 'ADMIN_ROL' }, { rol: 'PROF_ROL' }] })
            .sort({ nombre: 1 });

        res.json({
            ok: true,
            usuarios
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }
};

const getUsuariosFiltroRol = async(req, res) => {

    const rolUsuario = req.params.rol;
    const uid = req.uid;

    try {
        if (rolUsuario == 'USER_ROL') {
            const usuarios = await Usuario.find({ $or: [{ rol: 'ADMIN_ROL' }, { rol: 'PROF_ROL' }] })
                .sort({ nombre: 1 });
            return res.json({
                ok: true,
                usuarios
            });
        } else if (rolUsuario == 'ADMIN_ROL') {
            const usuarios = await Usuario.find()
                .sort({ nombre: 1 });

            return res.json({
                ok: true,
                usuarios
            });
        } else if (rolUsuario == 'PROF_ROL') {
            const asignaciones = [];
            const asignacion = await Asignacion.find({ profesional: uid })
                .populate('paciente', 'img rol google activo bio estado terminos conexiones _id nombre apellido email')
                .sort({ nombre: 1 });

            asignacion.forEach(item => {
                asignaciones.push(item.paciente);
            });

            return res.json({
                ok: true,
                usuarios: asignaciones
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
const getUsuariosRol = async(req, res) => {

    const rol = req.body.rol;

    try {

        const usuarios = await Usuario.find({ rol }, 'nombre apellido email rol google activo img bio estado pendiente')
            .sort({ nombre: 1 });

        res.json({
            ok: true,
            usuarios
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }

};

const crearUsuario = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            });
        }

        const usuario = new Usuario(req.body);

        usuario.terminos = true;

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
            token,
            menu: getMenuFrontEnd(usuario)
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
        const { password, google, email, anterior, nueva, repetir, ...campos } = req.body;

        if (anterior) {
            if (!nueva) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Debe ingresar una nueva contraseña'
                });
            } else {
                if (nueva == repetir) {

                    const validPassword = bcryptjs.compareSync(anterior, usuarioDB.password);

                    if (!validPassword) {
                        return res.status(400).json({
                            ok: false,
                            msg: 'Contraseña no válida'
                        });
                    }

                    // Encriptar contraseña

                    const salt = bcryptjs.genSaltSync();

                    campos.password = bcryptjs.hashSync(nueva, salt);

                } else {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Verifique que la nueva contraseña y la reptida sean las mismas'
                    });
                }
            }
        }

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
    const uidUser = req.uid;

    try {

        if (uid === uidUser) {
            return res.status(404).json({
                ok: false,
                msg: 'No se puede eliminar a si mismo'
            });
        }

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con el id'
            });
        }

        // await Usuario.findByIdAndRemove(uid);

        //Actualizar

        await Usuario.findByIdAndUpdate(uid, { activo: false, conexiones: 0, estado: false }, { new: true });

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

const habilitarUsuario = async(req, res = response) => {
    const uid = req.params.id;
    const uidUser = req.uid;

    try {

        if (uid === uidUser) {
            return res.status(404).json({
                ok: false,
                msg: 'No se puede habilitar a si mismo'
            });
        }

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con el id'
            });
        }

        // await Usuario.findByIdAndRemove(uid);

        //Actualizar

        await Usuario.findByIdAndUpdate(uid, { activo: true }, { new: true });

        res.json({
            ok: true,
            msg: 'Usuario habilitado'
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }
};

const terminosUsuario = async(req, res = response) => {
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

        await Usuario.findByIdAndUpdate(uid, { terminos: true }, { new: true });

        res.json({
            ok: true,
            msg: 'Terminos aceptados'
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
    borrarUsuario,
    getUsuariosAdministrativos,
    getUsuario,
    getUsuariosFiltroRol,
    habilitarUsuario,
    terminosUsuario,
    getUsuariosAsignaciones,
    getUsuariosAdministrativosPaginado,
    getUsuarioEmail
};
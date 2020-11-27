/*jshint esversion: 9 */

const { response } = require("express");

const Comunicado = require('../models/comunicado');

const getComunicados = async(req, res = response) => {

    const desde = Number(req.query.desde) || 0;
    const hasta = Number(req.query.hasta) || 0;

    try {
        const [comunicado, total] = await Promise.all([
            Comunicado.find()
            .populate('usuario', 'nombre apellido')
            .skip(desde)
            .limit(hasta)
            .sort({ fecha: -1 }),

            Comunicado.countDocuments()
        ]);

        res.json({
            ok: true,
            comunicado,
            total
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }

};

const getComunicado = async(req, res = response) => {

    const id = req.params.id;

    try {

        const comunicadoDB = await Comunicado.findById(id)
            .populate('usuario', 'nombre apellido');

        res.json({
            ok: true,
            comunicado: comunicadoDB
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }


};

const crearComunicado = async(req, res = response) => {

    const uid = req.uid;
    const comunicado = new Comunicado({ usuario: uid, ...req.body });

    try {

        const comunicadoDB = await comunicado.save();

        res.json({
            ok: true,
            comunicado: comunicadoDB
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }

};

const actualizarComunicado = async(req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const comunicadoDB = await Comunicado.findById(id);

        if (!comunicadoDB) {
            res.status(404).json({
                ok: false,
                msg: 'Noticia no encontrada'
            });
        }

        cambiosComunicado = {
            ...req.body,
            usuario: uid
        };

        const comunicadoActualizado = await Comunicado.findByIdAndUpdate(id, cambiosComunicado, { new: true });

        res.json({
            ok: true,
            comunicado: comunicadoActualizado
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }

};

const borrarComunicado = async(req, res = response) => {

    const id = req.params.id;

    try {

        const comunicadoDB = await Comunicado.findById(id);

        if (!comunicadoDB) {
            res.status(404).json({
                ok: false,
                msg: 'Comunicado no encontrado'
            });
        }

        await Comunicado.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Comunicado eliminado'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }
};

module.exports = {
    getComunicado,
    getComunicados,
    actualizarComunicado,
    borrarComunicado,
    crearComunicado
};
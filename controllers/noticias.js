/*jshint esversion: 9 */

const { response } = require("express");

const Noticia = require('../models/noticia');

const getNoticias = async(req, res = response) => {

    const desde = Number(req.query.desde) || 0;
    const hasta = Number(req.query.hasta) || 0;

    try {
        const [noticias, total] = await Promise.all([
            Noticia.find()
            .populate('usuario', 'nombre apellido')
            .skip(desde)
            .limit(hasta)
            .sort({ fecha: -1 }),

            Noticia.countDocuments()
        ]);

        res.json({
            ok: true,
            noticias,
            total
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }

};

const getNoticiasAll = async(req, res = response) => {

    try {
        const noticias = await Noticia.find()
            .populate('usuario', 'nombre apellido')
            .sort({ fecha: -1 });

        res.json({
            ok: true,
            noticias,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }

};

const getNoticia = async(req, res = response) => {

    const id = req.params.id;

    try {

        const noticiaDB = await Noticia.findById(id)
            .populate('usuario', 'nombre apellido img');

        res.json({
            ok: true,
            noticia: noticiaDB
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }


};

const crearNoticia = async(req, res = response) => {

    const uid = req.uid;
    const noticia = new Noticia({ usuario: uid, ...req.body });

    try {

        const noticiaDB = await noticia.save();

        res.json({
            ok: true,
            noticia: noticiaDB
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }

};

const actualizarNoticia = async(req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const noticiaDB = await Noticia.findById(id);

        if (!noticiaDB) {
            res.status(404).json({
                ok: false,
                msg: 'Noticia no encontrada'
            });
        }

        cambiosNoticia = {
            ...req.body,
            usuario: uid
        };

        const noticiaActualizado = await Noticia.findByIdAndUpdate(id, cambiosNoticia, { new: true });

        res.json({
            ok: true,
            noticia: noticiaActualizado
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }

};

const borrarNoticia = async(req, res = response) => {

    const id = req.params.id;

    try {

        const noticiaDB = await Noticia.findById(id);

        if (!noticiaDB) {
            res.status(404).json({
                ok: false,
                msg: 'Noticia no encontrada'
            });
        }

        await Noticia.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Noticia eliminada'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }
};

module.exports = {
    getNoticias,
    crearNoticia,
    actualizarNoticia,
    borrarNoticia,
    getNoticia,
    getNoticiasAll
};
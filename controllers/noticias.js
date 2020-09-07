/*jshint esversion: 9 */

const { response } = require("express");

const Noticia = require('../models/noticia');

const getNoticias = async(req, res = response) => {

    const noticias = await Noticia.find()
        .populate('usuario', 'nombre apellido');

    res.json({
        ok: true,
        noticias
    });
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

const actualizarNoticia = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'actualizar noticia'
    });
};

const borrarNoticia = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'borar noticia'
    });
};

module.exports = {
    getNoticias,
    crearNoticia,
    actualizarNoticia,
    borrarNoticia
};
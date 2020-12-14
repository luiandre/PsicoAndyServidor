/*jshint esversion: 9 */

const { response } = require("express");

const Historia = require('../models/historia');



const getHistoria = async(req, res = response) => {

    const id = req.params.id;

    try {

        const historiaDB = await Historia.findOne({ 'usuario': id })
            .populate('entrevistador', 'nombre apellido img');

        if (!historiaDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Sin historia'
            });
        }

        res.json({
            ok: true,
            historia: historiaDB
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }


};

const crearHistoria = async(req, res = response) => {

    const uid = req.uid;

    const historia = new Historia({ entrevistador: uid, actualizo: uid, ...req.body });


    try {

        const historiaDB = await historia.save();

        res.json({
            ok: true,
            historia: historiaDB
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }

};

const actualizarHistoria = async(req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const historiaDB = await Historia.findById(id);

        if (!historiaDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe historia para este usuario'
            });
        }

        cambiosHistoria = {
            ...req.body,
            actualizo: uid,
            fecha: historiaDB.fecha
        };

        const historiaActualizado = await Historia.findByIdAndUpdate(id, cambiosHistoria, { new: true });

        res.json({
            ok: true,
            historia: historiaActualizado
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }

};

module.exports = {
    getHistoria,
    crearHistoria,
    actualizarHistoria
};
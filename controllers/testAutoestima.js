/*jshint esversion: 9 */

const { response } = require("express");

const TestAutoestima = require('../models/testAutoestima');


const getTests = async(req, res = response) => {

    const id = req.params.id;

    try {

        const testDB = await TestAutoestima.find({ 'usuario': id })
            .populate('usuario', 'nombre apellido img');

        res.json({
            ok: true,
            tests: testDB
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Un error ha ocurrido'
        });
    }


};

const crearTest = async(req, res = response) => {

    const uid = req.uid;

    const test = new TestAutoestima({ usuario: uid, ...req.body });


    try {

        const testDB = await test.save();

        res.json({
            ok: true,
            test: testDB
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
    getTests,
    crearTest
};
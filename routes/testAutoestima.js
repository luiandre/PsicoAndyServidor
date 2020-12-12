/*jshint esversion: 9 */

// Ruta: /api/testautoestima

const { Router } = require('express');

const { getTests, crearTest } = require('../controllers/testAutoestima');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/:id', validarJWT, getTests);

router.post('/', [
        validarJWT,
    ],
    crearTest);

module.exports = router;
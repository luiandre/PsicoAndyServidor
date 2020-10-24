/*jshint esversion: 9 */

// Ruta: /api/salas

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/valida-campos');

const { getSala, crearSala, borrarSala, getSalas } = require('../controllers/salas');
const { validarJWT, validarAdminProfRol } = require('../middlewares/validar-jwt');

const router = Router();


router.get('/', validarJWT, getSalas);

router.get('/:uuid', validarJWT, getSala);

router.post('/:uid', [
        validarJWT,
    ],
    crearSala);

router.delete('/:uuid', validarJWT, validarAdminProfRol, borrarSala);

module.exports = router;
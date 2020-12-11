/*jshint esversion: 9 */

// Ruta: /api/historias

const { Router } = require('express');

const { getHistoria, crearHistoria, actualizarHistoria } = require('../controllers/historias');
const { validarJWT, validarAdminProfRol } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/:id', validarJWT, validarAdminProfRol, getHistoria);

router.post('/', [
        validarJWT,
        validarAdminProfRol
    ],
    crearHistoria);

router.put('/:id', [
        validarJWT,
        validarAdminProfRol,
    ],
    actualizarHistoria);

module.exports = router;
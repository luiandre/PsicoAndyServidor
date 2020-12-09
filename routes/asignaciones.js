/*jshint esversion: 9 */

// Ruta: /api/asignaciones

const { Router } = require('express');

const { getAsignaciones, crearAsignacion, borrarAsignacion } = require('../controllers/asignaciones');
const { validarJWT, validarAdminProfRol, validarAdminRol } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/:uid', validarJWT, validarAdminRol, getAsignaciones);

router.post('/', [
        validarJWT,
        validarAdminProfRol
    ],
    crearAsignacion);

router.delete('/:id', validarJWT, validarAdminProfRol, borrarAsignacion);

module.exports = router;
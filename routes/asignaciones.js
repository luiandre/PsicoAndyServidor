/*jshint esversion: 9 */

// Ruta: /api/asignaciones

const { Router } = require('express');

const { getAsignaciones, crearAsignacion, borrarAsignacion, getAsignacionesProfesional } = require('../controllers/asignaciones');
const { validarJWT, validarAdminProfRol, validarAdminRol } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/:uid', validarJWT, validarAdminProfRol, getAsignaciones);

router.get('/getAsignacionesProfesional/:uid', validarJWT, validarAdminProfRol, getAsignacionesProfesional);

router.post('/', [
        validarJWT,
        validarAdminProfRol
    ],
    crearAsignacion);

router.delete('/:id', validarJWT, validarAdminProfRol, borrarAsignacion);

module.exports = router;
/*jshint esversion: 9 */

// Ruta: /api/seguimientos

const { Router } = require('express');

const { getSeguimiento, obtenerSeguimientos, crearSeguimiento, actualizarSeguimiento, borrarSeguimiento } = require('../controllers/seguimiento');
const { validarJWT, validarAdminProfRol, validarAdminRol } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/:id', validarJWT, validarAdminRol, obtenerSeguimientos);

router.get('/getSeguimiento/:id', validarJWT, validarAdminRol, getSeguimiento);

router.post('/', [
        validarJWT,
        validarAdminProfRol
    ],
    crearSeguimiento);

router.put('/:id', validarJWT, validarAdminProfRol, actualizarSeguimiento);

router.delete('/:id', validarJWT, validarAdminProfRol, borrarSeguimiento);

module.exports = router;
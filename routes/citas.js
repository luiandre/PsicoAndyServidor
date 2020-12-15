/*jshint esversion: 9 */

// Ruta: /api/citas

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/valida-campos');

const { getCita, getCitas, crearCita, actualizarCita, borrarCita } = require('../controllers/citas');
const { validarJWT, validarAdminProfRol } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/:id', validarJWT, validarAdminProfRol, getCitas);

router.get('/getCita/:id', validarJWT, getCita);

router.post('/', [
        validarJWT,
        validarAdminProfRol,
        check('titulo', 'El titulo de la noticia es necesario').not().isEmpty(),
        check('fecha', 'La fecha es necesaria').not().isEmpty(),
        validarCampos
    ],
    crearCita);

router.put('/:id', [
        validarJWT,
        validarAdminProfRol,
        check('titulo', 'El titulo de la noticia es necesario').not().isEmpty(),
        validarCampos
    ],
    actualizarCita);

router.delete('/:id', validarJWT, validarAdminProfRol, borrarCita);

module.exports = router;
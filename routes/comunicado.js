/*jshint esversion: 9 */

// Ruta: /api/comunicados

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/valida-campos');

const { getComunicado, getComunicados, crearComunicado, actualizarComunicado, borrarComunicado } = require('../controllers/comunicado');
const { validarJWT, validarAdminProfRol } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getComunicados);

router.get('/:id', validarJWT, getComunicados);

router.post('/', [
        validarJWT,
        validarAdminProfRol,
        check('titulo', 'El titulo de la noticia es necesario').not().isEmpty(),
        check('detalle', 'El detalle de la noticia es necesario').not().isEmpty(),
        check('fecha', 'La fecha es necesaria').not().isEmpty(),
        validarCampos
    ],
    crearComunicado);

router.put('/:id', [
        validarJWT,
        validarAdminProfRol,
        check('titulo', 'El titulo de la noticia es necesario').not().isEmpty(),
        check('detalle', 'El detalle de la noticia es necesario').not().isEmpty(),
        check('fecha', 'La fecha es necesaria').not().isEmpty(),
        validarCampos
    ],
    actualizarComunicado);

router.delete('/:id', validarJWT, validarAdminProfRol, borrarComunicado);

module.exports = router;
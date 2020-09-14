/*jshint esversion: 9 */

// Ruta: /api/noticias

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/valida-campos');

const { getNoticias, getNoticia, crearNoticia, actualizarNoticia, borrarNoticia } = require('../controllers/noticias');
const { validarJWT, validarAdminProfRol } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', getNoticias);

router.get('/:id', validarJWT, getNoticia);

router.post('/', [
        validarJWT,
        validarAdminProfRol,
        check('titulo', 'El titulo de la noticia es necesario').not().isEmpty(),
        check('detalle', 'El detalle de la noticia es necesario').not().isEmpty(),
        check('fecha', 'La fecha es necesaria').not().isEmpty(),
        validarCampos
    ],
    crearNoticia);

router.put('/:id', [
        validarJWT,
        validarAdminProfRol,
        check('titulo', 'El titulo de la noticia es necesario').not().isEmpty(),
        check('detalle', 'El detalle de la noticia es necesario').not().isEmpty(),
        check('fecha', 'La fecha es necesaria').not().isEmpty(),
        validarCampos
    ],
    actualizarNoticia);

router.delete('/:id', validarJWT, validarAdminProfRol, borrarNoticia);

module.exports = router;
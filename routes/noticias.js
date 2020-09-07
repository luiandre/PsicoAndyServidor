/*jshint esversion: 9 */

// Ruta: /api/noticias

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/valida-campos');

const { getNoticias, crearNoticia, actualizarNoticia, borrarNoticia } = require('../controllers/noticias');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', getNoticias);

router.post('/', [
        validarJWT,
        check('titulo', 'El titulo de la noticia es necesario').not().isEmpty(),
        check('detalle', 'El detalle de la noticia es necesario').not().isEmpty(),
        check('img', 'La imagen es necesaria').not().isEmpty(),
        check('fecha', 'La fecha es necesaria').not().isEmpty(),
        validarCampos
    ],
    crearNoticia);

router.put('/:id', [
        validarJWT
    ],
    actualizarNoticia);

router.delete('/:id', validarJWT, borrarNoticia);

module.exports = router;
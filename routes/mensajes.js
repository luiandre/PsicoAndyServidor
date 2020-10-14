/*jshint esversion: 9 */

// Ruta: /api/mensajes

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/valida-campos');

const { crearMensaje, obtenerMensajes, activarPentiente, desactivarPentiente, obtenerUltimomensajeRecibido } = require('../controllers/mensajes');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/:para', validarJWT, obtenerMensajes);

router.get('/ultimo/:uid', validarJWT, obtenerUltimomensajeRecibido);


router.post('/', [
        validarJWT,
        check('de', 'El remitente es necesario').not().isEmpty(),
        check('para', 'El destinatario es necesario').not().isEmpty(),
        check('mensaje', 'El mensaje es necesaria').not().isEmpty(),
        validarCampos
    ],
    crearMensaje);

router.put('/activar/:id', activarPentiente);
router.put('/desactivar/:id', desactivarPentiente);

module.exports = router;
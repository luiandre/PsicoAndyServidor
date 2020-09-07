/*jshint esversion: 9 */

// Ruta: /api/servicios

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/valida-campos');

const { getServicios, crearServicio, actualizarServicio, borrarServicio } = require('../controllers/servicios');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', getServicios);

router.post('/', [
        validarJWT,
        check('titulo', 'El titulo del servicio es necesario').not().isEmpty(),
        check('detalle', 'El detalle del servicio es necesario').not().isEmpty(),
        check('fecha', 'La fecha es necesaria').not().isEmpty(),
        check('responsable', 'El responsable debe tener un id valido').isMongoId(),
        validarCampos
    ],
    crearServicio);

router.put('/:id', [
        validarJWT,
        check('titulo', 'El titulo del servicio es necesario').not().isEmpty(),
        check('detalle', 'El detalle del servicio es necesario').not().isEmpty(),
        check('fecha', 'La fecha es necesaria').not().isEmpty(),
        check('responsable', 'El responsable debe tener un id valido').isMongoId(),
        validarCampos
    ],
    actualizarServicio);

router.delete('/:id', validarJWT, borrarServicio);

module.exports = router;
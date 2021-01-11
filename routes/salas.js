/*jshint esversion: 9 */

// Ruta: /api/salas

const { Router } = require('express');

const { getSala, crearSala, borrarSala, getSalas, agregarSalaCon, eliminarSalaCon } = require('../controllers/salas');
const { validarJWT, validarAdminProfRol } = require('../middlewares/validar-jwt');

const router = Router();


router.get('/', validarJWT, getSalas);

router.get('/:uuid', validarJWT, getSala);

router.post('/:uid', [
        validarJWT,
    ],
    crearSala);

router.put('/agregarSalaCon/:uuid', [
        validarJWT,
    ],
    agregarSalaCon);

router.put('/eliminarSalaCon/:uuid', [
        validarJWT,
    ],
    eliminarSalaCon);

router.delete('/:uuid', validarJWT, validarAdminProfRol, borrarSala);

module.exports = router;
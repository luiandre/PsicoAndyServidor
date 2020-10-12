/*jshint esversion: 9 */

// Ruta: /api/login

const { Router } = require('express');

const {
    login,
    googleSignIn,
    renewToken,
    activarEstado,
    desactivarEstado
} = require('../controllers/auth');

const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/valida-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/', [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        validarCampos
    ],
    login
);

router.post('/google', [
        check('token', 'El token de Google es obligatorio').not().isEmpty(),
        validarCampos
    ],
    googleSignIn
);

router.get('/renew', [
        validarJWT
    ],
    renewToken
);

router.put('/activar/:id', activarEstado);
router.put('/desactivar/:id', desactivarEstado);

module.exports = router;
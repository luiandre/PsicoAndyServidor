/*jshint esversion: 9 */

// Ruta: /api/usuarios
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/valida-campos');

const {
    getUsuario,
    getUsuarios,
    getUsuariosRol,
    getUsuariosAdministrativos,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario,
    getUsuariosFiltroRol,
} = require('../controllers/usuarios');
const { validarJWT, validarAdminRol, validarAdminRoloUid } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/:id', getUsuario);

router.get('/', getUsuarios);

router.get('/rol', getUsuariosRol);

router.get('/rol/usuario/:rol', getUsuariosFiltroRol);

router.get('/rol/administrativos', getUsuariosAdministrativos);

router.post('/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('apellido', 'El apellido es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ],
    crearUsuario);

router.put('/:id', [
        validarJWT,
        validarAdminRoloUid,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('apellido', 'El apellido es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('rol', 'El rol es obligatorio').not().isEmpty(),
        validarCampos
    ],
    actualizarUsuario);


router.delete('/:id', validarJWT, validarAdminRol, borrarUsuario);

module.exports = router;
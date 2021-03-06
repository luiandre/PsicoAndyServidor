/*jshint esversion: 9 */

// Ruta: /api/upload/

const { Router } = require('express');
const fileUpload = require('express-fileupload');

const { cargarArchivo, obtenerImagen, obtenerImagenServidor } = require('../controllers/uploads');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.use(fileUpload());

router.put('/:tipo/:id', validarJWT, cargarArchivo);
router.get('/:tipo/:img', obtenerImagen);
router.get('/:img', obtenerImagenServidor);



module.exports = router;
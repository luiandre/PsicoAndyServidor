/*jshint esversion: 9 */

// Ruta: /api/todo/:busqueda

const { Router } = require('express');

const { getTodo, getDocumentos, getUsuariosBusquedaRol } = require('../controllers/busquedas');

const router = Router();

router.get('/:busqueda', getTodo);
router.get('/coleccion/:tabla/:busqueda', getDocumentos);
router.get('/usuariosChat/:rol/:busqueda', getUsuariosBusquedaRol);



module.exports = router;
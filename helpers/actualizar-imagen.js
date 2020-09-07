/*jshint esversion: 9 */

const fs = require('fs');

const Usuario = require('../models/usuario');
const Servicio = require('../models/servicio');
const Noticia = require('../models/noticia');

const borrarImagen = (path) => {

    if (fs.existsSync(path)) {
        //borrar la imagen anterior
        fs.unlinkSync(path);
    }
};

const actualizarImagen = async(tipo, id, nombreArchivo) => {

    let pathViejo = '';

    switch (tipo) {
        case 'usuarios':
            const usuario = await Usuario.findById(id);

            if (!usuario) {
                return false;
            }

            pathViejo = `./uploads/usuarios/${ usuario.img }`;

            borrarImagen(pathViejo);

            usuario.img = nombreArchivo;
            usuario.save();
            return true;

        case 'servicios':

            const servicio = await Servicio.findById(id);

            if (!servicio) {
                return false;
            }

            pathViejo = `./uploads/servicios/${ servicio.img }`;

            borrarImagen(pathViejo);

            servicio.img = nombreArchivo;
            servicio.save();
            return true;
        case 'noticias':

            const noticia = await Noticia.findById(id);

            if (!noticia) {
                return false;
            }

            pathViejo = `./uploads/noticias/${ noticia.img }`;

            borrarImagen(pathViejo);

            noticia.img = nombreArchivo;
            noticia.save();
            return true;

        default:
            break;
    }

};

module.exports = {
    actualizarImagen
};
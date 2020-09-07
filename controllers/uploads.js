/*jshint esversion: 9 */

const fs = require('fs');
const path = require('path');

const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require("../helpers/actualizar-imagen");


const cargarArchivo = (req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = ['noticias', 'servicios', 'usuarios'];

    if (!tiposValidos.includes(tipo)) {
        return res.status(404).json({
            ok: false,
            msg: 'No se encontro el tipo'
        });
    }

    //validar existencia de archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No se encontro ningun archivo'
        });
    }

    //Procesar la imagen
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.');

    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //Validar extensiones

    const extensionesValidas = ['png', 'jpg', 'jpeg'];

    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(404).json({
            ok: false,
            msg: 'No es un archivo permitido'
        });
    }

    //Generar nombre del archivo
    const nombreArchivo = `${ uuidv4() }.${extensionArchivo}`;

    //Path para guardar imagen

    const path = `./uploads/${ tipo }/${ nombreArchivo }`;

    // Mover la imagen
    file.mv(path, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al guardar la imagen en el servidor'
            });
        }

        //Actualizar BD

        actualizarImagen(tipo, id, nombreArchivo);

        res.json({
            ok: true,
            meg: 'Archivo subido',
            nombreArchivo
        });
    });

};

const obtenerImagen = (req, res) => {
    const tipo = req.params.tipo;
    const img = req.params.img;

    const pathImg = path.join(__dirname, `../uploads/${ tipo }/${ img }`);

    //Imagen por defecto
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        const pathImg = path.join(__dirname, `../uploads/no-image-found.jpg`);
        res.sendFile(pathImg);
    }


};

module.exports = {
    cargarArchivo,
    obtenerImagen
};
/*jshint esversion: 9 */

const jwt = require('jsonwebtoken');

const generarJWT = (uid) => {

    return new Promise((resolve, reject) => {

        const payload = {
            uid
        };

        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '6h'
        }, (err, token) => {
            if (err) {
                reject('No se pudo generar el JWT');
            } else {
                resolve(token);
            }
        });

    });


};

module.exports = {
    generarJWT
};
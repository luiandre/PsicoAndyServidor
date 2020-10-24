/*jshint esversion: 9 */

require('dotenv').config();
const path = require('path');

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

const app = express();

const server = require('http').createServer(app);

const io = require('socket.io')(server);

app.use(cors());

app.use(express.json());

dbConnection();

//Socket

io.on('connection', (socket) => {
    socket.on('guardar-mensaje', (nuevoMensaje) => {
        io.emit('nuevo-mensaje', nuevoMensaje);
    });

    socket.on('guardar-usuario', (usuario) => {
        io.emit('nuevo-usuario', usuario);
    });

    socket.on('guardar-usuarios', (usuarios) => {
        io.emit('nuevo-usuarios', usuarios);
    });

    // Videollamada
    socket.on('guardar-llamada', (data) => {
        io.emit('nuevo-llamada', data);
    });

    socket.on('sala-eliminada', (data) => {
        io.emit('nuevo-eliminada', data);
    });


});

//Directorio publico

app.use(express.static('public'));

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/noticias', require('./routes/noticias'));
app.use('/api/servicios', require('./routes/servicios'));
app.use('/api/salas', require('./routes/salas'));
app.use('/api/mensajes', require('./routes/mensajes'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/upload', require('./routes/uploads'));

// Lo último
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

server.listen(process.env.PORT, () => {
    console.log('Servidor corriendo');
});
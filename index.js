/*jshint esversion: 9 */

require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { PeerServer } = require('peer');

const { dbConnection } = require('./database/config');

const app = express();

const server = require('http').createServer(app);

const io = require('socket.io')(server);

const peerServer = PeerServer({
    port: 3001,
    secure: true,
    ssl: {
        key: fs.readFileSync('./ssl/privkey.pem'),
        cert: fs.readFileSync('./ssl/fullchain.pem')
    }
});

app.use(cors());

app.use(express.json());

dbConnection();

//Socket

io.on('connection', (socket) => {

    socket.on('guardar-dispositivo', (usuario) => {
        io.emit('nuevo-dispositivo', usuario);
    });

    socket.on('guardar-noticia', (nuevoMensaje) => {
        io.emit('nuevo-noticia', nuevoMensaje);
    });

    socket.on('guardar-asignacion', (asignacion) => {
        io.emit('nuevo-asignacion', asignacion);
    });

    socket.on('guardar-comunicado', (nuevoMensaje) => {
        io.emit('nuevo-comunicado', nuevoMensaje);
    });

    socket.on('guardar-mensaje', (nuevoMensaje) => {
        io.emit('nuevo-mensaje', nuevoMensaje);
    });

    socket.on('guardar-usuario', (usuario) => {
        io.emit('nuevo-usuario', usuario);
    });

    socket.on('guardar-usuarios', (usuarios) => {
        io.emit('nuevo-usuarios', usuarios);
    });

    socket.on('eliminar-usuarios', (usuarios) => {
        io.emit('nuevo-eliminado', usuarios);
    });
    // Videollamada
    socket.on('guardar-llamada', (data) => {
        io.emit('nuevo-llamada', data);
    });

    socket.on('sala-eliminada', (data) => {
        io.emit('nuevo-eliminada', data);
    });

    socket.on('llamada-rechazada', (data) => {
        io.emit('nuevo-rechazada', data);
    });

    // Salas
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId);
        });
    });
});

//Directorio publico

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/noticias', require('./routes/noticias'));
app.use('/api/asignaciones', require('./routes/asignaciones'));
app.use('/api/comunicados', require('./routes/comunicado'));
app.use('/api/servicios', require('./routes/servicios'));
app.use('/api/salas', require('./routes/salas'));
app.use('/api/mensajes', require('./routes/mensajes'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/upload', require('./routes/uploads'));
app.use('/api/historias', require('./routes/historias'));
app.use('/api/seguimientos', require('./routes/seguimientos'));
app.use('/api/testautoestima', require('./routes/testAutoestima'));
app.use('/api/citas', require('./routes/citas'));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

server.listen(process.env.PORT, () => {
    console.log('Servidor corriendo');
});
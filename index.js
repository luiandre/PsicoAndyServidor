/*jshint esversion: 9 */

require('dotenv').config();
const path = require('path');

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

const app = express();

app.use(cors());

app.use(express.json());

dbConnection();

//Directorio publico

app.use(express.static('public'));

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/noticias', require('./routes/noticias'));
app.use('/api/servicios', require('./routes/servicios'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/upload', require('./routes/uploads'));

// Lo último
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo');
});
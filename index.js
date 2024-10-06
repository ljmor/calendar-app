const express = require('express');
const cors = require('cors');
const path = require('path');
const { dbConection } = require('./database/config');
require('dotenv').config(); // Asi se vinculan las variables de entorno que establecimos en .env

// Crear el server de express
const app = express();

// Base de datos
dbConection();

// CORS
app.use(cors());

// Directorio publico
app.use( express.static('public') ); // Aqui se montará todo el fronted de React

// Lectura y parseo del body
app.use( express.json() );

// Rutas de la app
// Auth routes
app.use('/api/auth', require('./routes/auth'));
// CRUD eventos routes
app.use('/api/events', require('./routes/events'));

app.use('*', (req, res) => {
    res.sendFile(path.join( __dirname, 'public/index.html' ));
});

// Escuchar peticiones ( process.env.PORT se usa para acceder nuestra variable
// de entorno en la que establecimos el puerto )
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});
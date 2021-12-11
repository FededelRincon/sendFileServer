const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

// Crear el servidor
const app = express();


// Conectar a la base de datos
connectDB();

// Habilitar CORS
const optionsCors = {
    origin: process.env.FRONTEND_URL
}
app.use( cors(optionsCors) );   //solo acepta peticiones de mi frontend

// Puerto de la app
const port = process.env.PORT || 4000;

// habilitar body parser
app.use( express.json() );


// Habilitar carpeta publica
app.use( express.static('uploads'));


// Rutas de la app
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/links', require('./routes/links'));
app.use('/api/files', require('./routes/files'));


//Arrancar la app
app.listen( port, '0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto ${ port }`);
});
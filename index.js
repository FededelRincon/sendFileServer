const express = require('express');
const connectDB = require('./config/db');


// Crear el servidor
const app = express();


// Conectar a la base de datos
connectDB();


// Puerto de la app
const port = process.env.PORT || 4000;

// habilitar body parser
app.use( express.json() );

// Rutas de la app
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/links', require('./routes/links'));
app.use('/api/files', require('./routes/files'));


//Arrancar la app
app.listen( port, '0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto ${ port }`);
});
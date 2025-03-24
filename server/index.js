const mysql = require('mysql2');
const express = require('express');
const app = express();
const port = 3000;

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡Hola, mundo desde Express!');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

// Conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'cinechamp',
    password: 'admin123.',
    database: 'dbcinechamp'
});

connection.connect(err => {
    if (err) {
        console.error('Error de conexión:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Ruta que obtiene datos de la base
app.get('/heroes', (req, res) => {
    connection.query('SELECT * FROM heroes', (err, results) => {
        if (err) {
            res.status(500).send('Error en la base de datos');
            return;
        }
        res.json(results);
    });
});

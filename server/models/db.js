const mysql = require('mysql2/promise');
// dotenv = Se importa para manejar variables de entorno desde un archivo .env. 
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = pool;

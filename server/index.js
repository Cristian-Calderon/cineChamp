const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./models/db.js');
const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/usuarios', usuarioRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.send('API corriendo 🎉');
});

// Ruta para comprobar conexión a la base de datos
app.get('/check-db', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.send('✅ Conectado a la base de datos');
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    res.status(500).send('❌ No se pudo conectar a la base de datos');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});

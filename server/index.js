const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./models/db.js');
const usuarioRoutes = require('./routes/usuarioRoutes');
const contenidoRoutes = require('./routes/contenidoRoutes');
const logrosRoutes = require('./routes/logrosRoutes');
const path = require('path');
const { verificarLogros } = require('./controllers/logrosController.js');



const app = express();
app.use(express.static('public'));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use("/uploads", express.static(path.join(__dirname, "/server/assets/uploads")));




app.use(cors());
app.use(express.json());
app.use('/api/logros', logrosRoutes);

app.use('/api/usuarios', usuarioRoutes);
app.use('/contenido', contenidoRoutes); 
app.use('/api/contenido', contenidoRoutes); 

// Ruta raíz
app.get('/', (req, res) => {
  res.send('API corriendo 🎉');
});

// Verificar conexión a la base de datos
app.get('/check-db', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.send('✅ Conectado a la base de datos');
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    res.status(500).send('❌ No se pudo conectar a la base de datos');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});

//parte social/amigos
const amigosRoutes = require('./routes/socialRoutes');
app.use('/api/amigos', amigosRoutes);

app.get('/api/logros/forzar/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  await verificarLogros(id);
  res.send(`Verificación forzada para usuario ${id}`);
});
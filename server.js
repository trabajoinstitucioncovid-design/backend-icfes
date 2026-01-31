require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');       // ✅ ESTA LÍNEA ES VITAL (Arregla tu error rojo)
const path = require('path');       // ✅ ESTA LÍNEA ES VITAL (Para la carpeta public)

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

// --- CONFIGURACIÓN BASE DE DATOS ---
// Aquí el código es inteligente: Si estamos en Vercel busca MONGO_URI, 
// si estamos en tu PC busca MONGODB_URI (la que tienes en tu .env)
const dbConnection = process.env.MONGO_URI || process.env.MONGODB_URI;

// --- MIDDLEWARE ---
app.use(cors()); // Ahora sí funcionará porque la importamos arriba
app.use(express.json());

// Configuración de la carpeta pública (Frontend)
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

// --- CONEXIÓN A MONGODB ---
if (!dbConnection) {
    console.error("❌ ERROR CRÍTICO: No se encontró la variable de entorno para la Base de Datos");
} else {
    mongoose.connect(dbConnection)
      .then(() => console.log('✅ Conectado a MongoDB'))
      .catch(err => console.error('❌ Error de conexión:', err.message));
}

// --- RUTAS ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// --- RUTA DE PRUEBA ---
app.get('/', (req, res) => {
  res.json({ 
      message: '✅ Backend funcionando correctamente', 
      environment: process.env.NODE_ENV 
  });
});

// --- EXPORTAR APP PARA VERCEL ---
module.exports = app;

// --- INICIAR SERVIDOR (Solo local) ---
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo localmente en http://localhost:${PORT}`);
  });
}
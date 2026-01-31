require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// Asegúrate de que las rutas sigan en la misma carpeta, si no ajusta estos paths
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

// --- CONFIGURACIÓN BASE DE DATOS ---
// Buscamos la variable MONGO_URI (Vercel) o MONGODB_URI (Local)
const dbConnection = process.env.MONGO_URI || process.env.MONGODB_URI;

// Middleware
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // <--- ¡ESTA ES LA LÍNEA NUEVA!
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB
if (!dbConnection) {
    console.error("❌ ERROR CRÍTICO: No se encontró la variable de entorno MONGO_URI");
} else {
    mongoose.connect(dbConnection)
      .then(() => console.log('✅ Conectado a MongoDB'))
      .catch(err => {
        console.error('❌ Error de conexión a MongoDB:', err.message);
        // En Vercel evitamos el process.exit(1) para no tumbar la lambda completa si falla un intento
      });
}

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Ruta de prueba (Ideal para verificar que Vercel ya cargó)
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ Backend de LUKXTEC funcionando en la Nube',
    version: '1.0.0',
    enviroment: process.env.NODE_ENV || 'development'
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal en el servidor!' });
});

// --- CONFIGURACIÓN ESPECIAL PARA VERCEL ---
// Solo iniciamos el servidor manualmente si NO estamos en Vercel (modo local)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo localmente en http://localhost:${PORT}`);
  });
}

// Exportamos la aplicación para que Vercel la ejecute como Serverless Function
module.exports = app;
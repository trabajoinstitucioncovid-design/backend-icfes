const express = require('express');
const router = express.Router(); // ✅ Definimos router al principio
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // ✅ Debe coincidir con el nombre del archivo (Mayúscula)

// 🔐 IMPORTANTE: La misma clave que en auth.js
const JWT_SECRET = process.env.JWT_SECRET || 'secreto_super_seguro_123';

// --- MIDDLEWARE DE PROTECCIÓN ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. Token requerido.' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error("Error verificando token:", err.message);
      return res.status(403).json({ error: 'Token inválido o expirado.' });
    }
    req.user = user;
    next();
  });
};

// --- RUTAS ---

// 1. Obtener Perfil (GET)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ user });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// 2. Guardar Test Principal (POST)
router.post('/test-results', authenticateToken, async (req, res) => {
  try {
    const { testResults } = req.body;
    
    // Buscamos usuario
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Si el array no existe (por seguridad), lo iniciamos
    if (!user.testResults) user.testResults = [];
    
    // Agregamos el nuevo resultado al array
    user.testResults.push({
      resultados: testResults.resultados || {},
      respuestas: testResults.respuestas || {},
      timestamp: new Date().toISOString()
    });
    
    await user.save();
    
    res.json({ user });
  } catch (error) {
    console.error('Error guardando resultados:', error);
    res.status(500).json({ error: 'Error al guardar resultados' });
  }
});

// 3. Guardar Resultados ICFES (POST)
router.post('/icfes-results', authenticateToken, async (req, res) => {
  try {
    const { testType, results } = req.body;
    // testType puede ser: "matematicas", "lectura", etc.

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // 1. Actualizar el test específico
    // Usamos notación de corchetes para acceder dinámicamente
    if (!user.testsICFES) user.testsICFES = {};
    user.testsICFES[testType] = results;

    // 2. Calcular progreso general del ICFES
    const tests = user.testsICFES;
    // Contamos cuántos tienen "completado: true"
    const completedCount = Object.values(tests).filter(t => t && t.completado).length;
    const totalTests = 5; // Son 5 materias
    const percentage = Math.round((completedCount / totalTests) * 100);

    // 3. Actualizar el plan de progreso
    if (!user.planProgress) user.planProgress = { icfes: {} };
    if (!user.planProgress.icfes) user.planProgress.icfes = {};

    user.planProgress.icfes.percentage = percentage;
    user.planProgress.icfes[testType] = {
      completado: results.completado,
      puntaje: results.puntaje
    };

    // Guardamos todo de una vez
    // Usamos markModified porque estamos editando objetos anidados
    user.markModified('testsICFES');
    user.markModified('planProgress');
    
    await user.save();
    
    res.json({ user });
  } catch (error) {
    console.error('Error ICFES:', error);
    res.status(500).json({ error: 'Error al guardar ICFES' });
  }
});

// 4. Progreso de Exploración (POST)
router.post('/exploration-progress', authenticateToken, async (req, res) => {
  try {
    const { tarea1, tarea2, tarea3 } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Calcular porcentaje (cada tarea vale 33.3%)
    const tareas = [tarea1, tarea2, tarea3];
    const completadas = tareas.filter(Boolean).length;
    const percentage = Math.round((completadas / 3) * 100);

    // Actualizar datos
    if (!user.planProgress) user.planProgress = { exploracion: {} };
    if (!user.planProgress.exploracion) user.planProgress.exploracion = {};

    user.planProgress.exploracion = {
      tarea1,
      tarea2,
      tarea3,
      percentage
    };

    user.markModified('planProgress');
    await user.save();
    
    res.json({ user });
  } catch (error) {
    console.error('Error exploracion:', error);
    res.status(500).json({ error: 'Error al actualizar progreso' });
  }
});

module.exports = router;
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = process.env;

const router = express.Router();

// Middleware para verificar token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. Token requerido.' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido.' });
    }
    req.user = user;
    next();
  });
};

// Guardar resultados del test principal (VARIOS RESULTADOS)
router.post('/test-results', authenticateToken, async (req, res) => {
  try {
    const { testResults } = req.body;
    
    // ✅ Guarda MÚLTIPLES resultados en un array
    const user = await User.findById(req.user.userId);
    
    // Si no existe el array, lo crea
    if (!user.testResults) {
      user.testResults = [];
    }
    
    // Añade el nuevo resultado al array
    user.testResults.push({
      resultados: testResults.resultados || {},
      respuestas: testResults.respuestas || {},
      timestamp: new Date().toISOString()
    });
    
    // Guarda el usuario actualizado
    await user.save();
    
    res.json({ user: await User.findById(req.user.userId).select('-password') });
  } catch (error) {
    console.error('Error al guardar resultados:', error);
    res.status(500).json({ error: 'Error al guardar resultados' });
  }
});

// Guardar resultados de tests ICFES
router.post('/icfes-results', authenticateToken, async (req, res) => {
  try {
    const { testType, results } = req.body;
    const update = {};
    update[`testsICFES.${testType}`] = results;
    
    // Calcular progreso ICFES
    const user = await User.findById(req.user.userId);
    const currentTests = user.testsICFES || {};
    currentTests[testType] = results;
    
    const completedTests = Object.values(currentTests).filter(t => t.completado).length;
    const totalTests = 5;
    const icfesPercentage = Math.round((completedTests / totalTests) * 100);
    
    update['planProgress.icfes.percentage'] = icfesPercentage;
    update[`planProgress.icfes.${testType}`] = {
      completado: results.completado,
      puntaje: results.puntaje
    };
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      update,
      { new: true, select: '-password' }
    );
    
    res.json({ user: updatedUser });
  } catch (error) {
    console.error('Error al guardar resultados ICFES:', error);
    res.status(500).json({ error: 'Error al guardar resultados ICFES' });
  }
});

// Obtener datos del usuario
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json({ user });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
});

// Actualizar progreso de exploración
router.post('/exploration-progress', authenticateToken, async (req, res) => {
  try {
    const { tarea1, tarea2, tarea3 } = req.body;
    const completedTasks = [tarea1, tarea2, tarea3].filter(Boolean).length;
    const percentage = Math.round((completedTasks / 3) * 100);
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        'planProgress.exploracion.tarea1': tarea1,
        'planProgress.exploracion.tarea2': tarea2,
        'planProgress.exploracion.tarea3': tarea3,
        'planProgress.exploracion.percentage': percentage
      },
      { new: true, select: '-password' }
    );
    
    res.json({ user });
  } catch (error) {
    console.error('Error al actualizar progreso:', error);
    res.status(500).json({ error: 'Error al actualizar progreso' });
  }
});

module.exports = router;
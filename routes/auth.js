const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
const User = require('../models/User'); // Asegúrate que el archivo se llame User.js (con U)

const JWT_SECRET = process.env.JWT_SECRET || 'secreto_temporal_123';

// --- REGISTRO ---
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Validaciones
    if (!email || !password) return res.status(400).json({ error: 'Faltan datos' });
    if (password.length < 6) return res.status(400).json({ error: 'Contraseña muy corta' });
    
    // Verificar duplicados
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email ya registrado' });
    
    // ✅ CREAR USUARIO (Sin encriptar aquí, tu User.js lo hace solo)
    const newUser = new User({
      email,
      password, // Se manda plana, el modelo la encriptará
      profile: {
        name: name || email.split('@')[0] // Se guarda dentro de profile
      }
    });

    await newUser.save(); // Aquí se dispara tu "pre save" y se encripta
    
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ 
      message: 'Usuario creado', 
      token, 
      user: { id: newUser._id, email: newUser.email, name: newUser.profile.name } 
    });
    
  } catch (error) {
    console.error('Error registro:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// --- LOGIN ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Usuario no encontrado' });
    
    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Contraseña incorrecta' });
    
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ 
      message: 'Login exitoso', 
      token, 
      user: { id: user._id, email: user.email, name: user.profile.name } 
    });
    
  } catch (error) {
    console.error('Error login:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;
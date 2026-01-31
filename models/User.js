const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // ✅ CORREGIDO: Usamos bcryptjs

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  profile: {
    name: { 
      type: String, 
      default: function() {
        // Si no hay nombre, usa la parte antes del @ del correo
        return this.email ? this.email.split('@')[0] : 'Usuario';
      }
    }
  },
  
  // ✅ ARRAY de resultados
  testResults: [{
    resultados: {
      salud: { type: Number, default: 0 },
      ingenieria: { type: Number, default: 0 },
      arte: { type: Number, default: 0 },
      derecho: { type: Number, default: 0 },
      negocios: { type: Number, default: 0 },
      ciencias: { type: Number, default: 0 },
      matematicas: { type: Number, default: 0 },
      lectura: { type: Number, default: 0 }
    },
    respuestas: {
      q1: Number, q2: Number, q3: Number, q4: Number, q5: Number,
      q6: Number, q7: Number, q8: Number, q9: Number, q10: Number
    },
    timestamp: { 
      type: String, 
      default: () => new Date().toISOString() 
    }
  }],
  
  planProgress: {
    exploracion: {
      tarea1: { type: Boolean, default: false },
      tarea2: { type: Boolean, default: false },
      tarea3: { type: Boolean, default: false },
      percentage: { type: Number, default: 0 }
    },
    icfes: {
      matematicas: { completado: { type: Boolean, default: false }, puntaje: { type: Number, default: 0 } },
      lectura: { completado: { type: Boolean, default: false }, puntaje: { type: Number, default: 0 } },
      ciencias: { completado: { type: Boolean, default: false }, puntaje: { type: Number, default: 0 } },
      ingles: { completado: { type: Boolean, default: false }, puntaje: { type: Number, default: 0 } },
      sociales: { completado: { type: Boolean, default: false }, puntaje: { type: Number, default: 0 } },
      percentage: { type: Number, default: 0 }
    }
  },
  
  testsICFES: {
    matematicas: { completado: { type: Boolean, default: false }, puntaje: { type: Number, default: 0 }, respuestas: { type: Object, default: {} } },
    lectura: { completado: { type: Boolean, default: false }, puntaje: { type: Number, default: 0 }, respuestas: { type: Object, default: {} } },
    sociales: { completado: { type: Boolean, default: false }, puntaje: { type: Number, default: 0 }, respuestas: { type: Object, default: {} } },
    ciencias: { completado: { type: Boolean, default: false }, puntaje: { type: Number, default: 0 }, respuestas: { type: Object, default: {} } },
    ingles: { completado: { type: Boolean, default: false }, puntaje: { type: Number, default: 0 }, respuestas: { type: Object, default: {} } }
  }
}, { 
  timestamps: true 
});

// ✅ ENCRIPTACIÓN AUTOMÁTICA
// Este bloque se encarga de encriptar la contraseña antes de guardar.
// Por eso en auth.js NO debemos encriptarla manualmente.
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);
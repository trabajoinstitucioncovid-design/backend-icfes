const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
        return this.email.split('@')[0];
      }
    }
  },
  
  // ✅ CAMBIO CRÍTICO: testResults ahora es un ARRAY
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
      q1: Number,
      q2: Number,
      q3: Number,
      q4: Number,
      q5: Number,
      q6: Number,
      q7: Number,
      q8: Number,
      q9: Number,
      q10: Number
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
      matematicas: { 
        completado: { type: Boolean, default: false },
        puntaje: { type: Number, default: 0 }
      },
      lectura: { 
        completado: { type: Boolean, default: false },
        puntaje: { type: Number, default: 0 }
      },
      ciencias: { 
        completado: { type: Boolean, default: false },
        puntaje: { type: Number, default: 0 }
      },
      ingles: { 
        completado: { type: Boolean, default: false },
        puntaje: { type: Number, default: 0 }
      },
      sociales: { 
        completado: { type: Boolean, default: false },
        puntaje: { type: Number, default: 0 }
      },
      percentage: { type: Number, default: 0 }
    }
  },
  
  testsICFES: {
    matematicas: {
      completado: { type: Boolean, default: false },
      puntaje: { type: Number, default: 0 },
      respuestas: { type: Object, default: {} }
    },
    lectura: {
      completado: { type: Boolean, default: false },
      puntaje: { type: Number, default: 0 },
      respuestas: { type: Object, default: {} }
    },
    sociales: {
      completado: { type: Boolean, default: false },
      puntaje: { type: Number, default: 0 },
      respuestas: { type: Object, default: {} }
    },
    ciencias: {
      completado: { type: Boolean, default: false },
      puntaje: { type: Number, default: 0 },
      respuestas: { type: Object, default: {} }
    },
    ingles: {
      completado: { type: Boolean, default: false },
      puntaje: { type: Number, default: 0 },
      respuestas: { type: Object, default: {} }
    }
  }
}, { 
  timestamps: true 
});

// Hash de contraseña antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('User', userSchema);
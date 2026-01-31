// scripts/auth.js - FRONTEND

// Maneja el registro
document.getElementById('register-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const errorMessage = document.getElementById('error-message');
  
  // Validaciones
  if (password !== confirmPassword) {
    errorMessage.textContent = 'Las contraseñas no coinciden';
    return;
  }
  
  if (password.length < 6) {
    errorMessage.textContent = 'La contraseña debe tener al menos 6 caracteres';
    return;
  }
  
  try {
    // Envía datos a tu backend local
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Guarda el token en localStorage
      localStorage.setItem('authToken', data.token);
      // Guarda el nombre del usuario
      localStorage.setItem('userData', JSON.stringify({
        name: data.user.name || data.user.email.split('@')[0]
      }));
      // Redirige al dashboard
      window.location.href = 'dashboard.html';
    } else {
      errorMessage.textContent = data.error || 'Error al registrar';
    }
    
  } catch (error) {
    console.error('Error:', error);
    errorMessage.textContent = 'Error de conexión. Verifica que el servidor esté corriendo.';
  }
});

// Maneja el login
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // ✅ Corrección: Elimina la línea que busca 'name' (no existe en login)
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('error-message');
  
  // Validaciones
  if (!email || !password) {
    errorMessage.textContent = 'Email y contraseña son requeridos';
    return;
  }
  
  try {
    // Envía datos a tu backend local
    const response = await fetch('https://backend-icfes.vercel.app/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Guarda el token en localStorage
      localStorage.setItem('authToken', data.token);
      // Guarda el nombre del usuario (viene del backend)
      localStorage.setItem('userData', JSON.stringify({
        name: data.user.name || data.user.email.split('@')[0]
      }));
      // Redirige al dashboard
      window.location.href = 'dashboard.html';
    } else {
      errorMessage.textContent = data.error || 'Credenciales inválidas';
    }
    
  } catch (error) {
    console.error('Error:', error);
    errorMessage.textContent = 'Error de conexión. Verifica que el servidor esté corriendo.';
  }
});

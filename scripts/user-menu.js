// scripts/user-menu.js

document.addEventListener('DOMContentLoaded', () => {
  const userProfile = document.getElementById('user-profile');
  const userName = document.getElementById('user-name');
  const userIcon = document.getElementById('user-icon');
  const dropdownMenu = document.getElementById('dropdown-menu');
  const logoutButton = document.getElementById('logout');

  // Verifica si el usuario está logueado
  const token = localStorage.getItem('authToken');
  
  if (token) {
    // Muestra el menú de usuario
    userProfile.style.display = 'flex';
    
    // Obtiene el nombre del usuario
    const userData = JSON.parse(localStorage.getItem('userData')) || { 
      name: 'Usuario' 
    };
    userName.textContent = userData.name || 'Usuario';
    
    // Maneja el clic en el ícono de usuario
    userIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.style.display = 
        dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });
    
    // Maneja el cierre de sesión
    if (logoutButton) {
      logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = '../pages/login.html';
      });
    }
    
    // Cierra el menú al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!userProfile.contains(e.target)) {
        dropdownMenu.style.display = 'none';
      }
    });
  } else {
    // Si no está logueado, oculta el menú
    if (userProfile) {
      userProfile.style.display = 'none';
    }
  }
});
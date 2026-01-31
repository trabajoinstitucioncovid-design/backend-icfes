document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('authToken');
  const resultsContainer = document.getElementById('results-container');
  const noResults = document.getElementById('no-results');
  
  if (!token) {
    alert('Debes iniciar sesión para ver tus resultados');
    window.location.href = '../pages/login.html';
    return;
  }
  
  try {
    const response = await fetch('http://localhost:5000/api/users/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener el perfil');
    }
    
    const data = await response.json();
    console.log('Datos del usuario:', data); // Para debug
    
    // Verifica si hay resultados guardados
    let resultados = [];
    if (data.user && data.user.testResults) {
      if (Array.isArray(data.user.testResults)) {
        resultados = data.user.testResults;
      } else if (data.user.testResults.resultados) {
        // Si es un solo resultado (formato antiguo), lo convertimos a array
        resultados = [{
          resultados: data.user.testResults.resultados,
          respuestas: data.user.testResults.respuestas || {},
          timestamp: data.user.testResults.timestamp || new Date().toISOString()
        }];
      }
    }
    
    console.log('Resultados procesados:', resultados); // Para debug
    
    if (resultados.length > 0) {
      // Ordena resultados por fecha (más reciente primero)
      const sortedResults = resultados.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
      
      // Oculta mensaje de "no hay resultados"
      noResults.style.display = 'none';
      
      // Muestra cada resultado en una tarjeta
      sortedResults.forEach((result, index) => {
        const card = document.createElement('div');
        card.className = 'result-card';
        
        // Calcula áreas principales
        const areasOrdenadas = Object.entries(result.resultados || {})
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3);
        
        // Carreras recomendadas según áreas
        const carreras = {
          salud: 'Psicología Clínica',
          ingenieria: 'Ingeniería de Sistemas',
          arte: 'Diseño Gráfico',
          derecho: 'Derecho',
          negocios: 'Administración',
          ciencias: 'Biología',
          matematicas: 'Matemáticas',
          lectura: 'Comunicación Social'
        };
        
        // Mapeo de áreas a páginas
        const areaToPage = {
          salud: '../pages/area-salud.html',
          ingenieria: '../pages/area-ingenieria.html',
          arte: '../pages/area-arte.html',
          derecho: '../pages/area-derecho.html',
          negocios: '../pages/area-negocios.html',
          ciencias: '../pages/area-salud.html',
          matematicas: '../pages/area-tecnologia.html',
          lectura: '../pages/area-arte.html'
        };
        
        // Formatea la fecha
        const fecha = new Date(result.timestamp);
        const fechaFormateada = fecha.toLocaleDateString('es-ES', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        // Genera HTML de la tarjeta
        const html = `
          <div class="result-header">
            <h3>Resultado #${sortedResults.length - index}</h3>
            <div class="compatibilidad">${fechaFormateada}</div>
          </div>
          <div class="result-body">
            <h4>Áreas con mayor puntuación:</h4>
            <ul class="areas-list">
              ${areasOrdenadas.map(([area, score]) => 
                `<li><strong>${area.toUpperCase()}</strong>: ${score} puntos</li>`
              ).join('')}
            </ul>
            <h4>Carreras recomendadas:</h4>
            <ul class="carreras-list">
              ${areasOrdenadas.map(([area]) => 
                `<li>${carreras[area] || 'Carrera relacionada'}</li>`
              ).join('')}
            </ul>
            <div class="universities-links">
              <h5>Explora estas áreas:</h5>
              ${areasOrdenadas.map(([area]) => 
                `<a href="${areaToPage[area]}" class="btn-area">${carreras[area] || 'Ver más'}</a>`
              ).join('')}
            </div>
          </div>
        `;
        
        card.innerHTML = html;
        resultsContainer.appendChild(card);
      });
    } else {
      noResults.style.display = 'block';
    }
  } catch (error) {
    console.error('Error cargando resultados:', error);
    noResults.textContent = 'Error al cargar tus resultados. Inténtalo más tarde.';
    noResults.style.display = 'block';
  }
});
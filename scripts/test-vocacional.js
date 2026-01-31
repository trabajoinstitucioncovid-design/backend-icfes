// Verifica autenticación
const token = localStorage.getItem('authToken');
if (!token) {
  alert('Debes iniciar sesión para hacer el test');
  window.location.href = '../pages/login.html';
}

// Maneja el envío del formulario
document.getElementById('vocacional-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Obtiene respuestas
  const q1 = parseInt(document.querySelector('input[name="q1"]:checked').value);
  const q2 = parseInt(document.querySelector('input[name="q2"]:checked').value);
  const q3 = parseInt(document.querySelector('input[name="q3"]:checked').value);
  const q4 = parseInt(document.querySelector('input[name="q4"]:checked').value);
  const q5 = parseInt(document.querySelector('input[name="q5"]:checked').value);
  const q6 = parseInt(document.querySelector('input[name="q6"]:checked').value);
  const q7 = parseInt(document.querySelector('input[name="q7"]:checked').value);
  const q8 = parseInt(document.querySelector('input[name="q8"]:checked').value);
  const q9 = parseInt(document.querySelector('input[name="q9"]:checked').value);
  const q10 = parseInt(document.querySelector('input[name="q10"]:checked').value);
  
  // Calcula áreas
  const areas = { 
    salud: 0, ingenieria: 0, arte: 0, derecho: 0, negocios: 0,
    ciencias: 0, matematicas: 0, lectura: 0
  };
  
  areas.arte += q1;
  areas.matematicas += q2;
  areas.salud += q3;
  areas.ingenieria += q4;
  areas.derecho += q5;
  areas.negocios += q6;
  areas.matematicas += q7;
  areas.lectura += q8;
  areas.ciencias += q9;
  
  if (q10 >= 4) {
    areas.salud += q10;
    areas.derecho += q10;
  } else {
    areas.ingenieria += q10;
    areas.matematicas += q10;
  }
  
  // Guarda en backend
  try {
    const response = await fetch('http://localhost:5000/api/users/test-results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        testResults: {
          resultados: areas,
          respuestas: { q1, q2, q3, q4, q5, q6, q7, q8, q9, q10 },
          timestamp: new Date().toISOString()
        }
      })
    });
    
    if (response.ok) {
      // Muestra resultados
      mostrarResultados(areas);
    } else {
      alert('Error al guardar resultados. Inténtalo de nuevo.');
    }
  } catch (error) {
    console.error('Error guardando resultados:', error);
    alert('Error al guardar resultados. Inténtalo de nuevo.');
  }
});

// Muestra resultados
function mostrarResultados(areas) {
  document.getElementById('test-form-container').style.display = 'none';
  document.getElementById('resultados-container').style.display = 'block';
  
  // Ordena áreas por puntuación
  const areasOrdenadas = Object.entries(areas)
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
  
  // Genera HTML de resultados
  const resultadosHTML = `
    <h3>Tus Resultados</h3>
    <div class="result-card">
      <div class="result-header">
        <h3>Áreas con mayor puntuación:</h3>
      </div>
      <div class="result-body">
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
    </div>
  `;
  
  document.getElementById('recomendaciones').innerHTML = resultadosHTML;
}

// Botón para repetir el test
document.getElementById('repetir-test').addEventListener('click', () => {
  document.getElementById('test-form-container').style.display = 'block';
  document.getElementById('resultados-container').style.display = 'none';
  
  // Resetea el formulario
  document.getElementById('vocacional-form').reset();
});
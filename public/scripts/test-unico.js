document.getElementById('test-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Calcula puntajes
  const areas = { 
    salud: 0, ingenieria: 0, arte: 0, derecho: 0, negocios: 0,
    ciencias: 0, matematicas: 0, lectura: 0
  };
  
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
  
  // ✅ CORRECCIÓN: Estructura completa con resultados y respuestas
  const testResults = {
    resultados: {
      salud: areas.salud,
      ingenieria: areas.ingenieria,
      arte: areas.arte,
      derecho: areas.derecho,
      negocios: areas.negocios,
      ciencias: areas.ciencias,
      matematicas: areas.matematicas,
      lectura: areas.lectura
    },
    respuestas: {
      q1: q1,
      q2: q2,
      q3: q3,
      q4: q4,
      q5: q5,
      q6: q6,
      q7: q7,
      q8: q8,
      q9: q9,
      q10: q10
    }
  };
  
  // Guarda en localStorage
  localStorage.setItem('userPlan', JSON.stringify({
    timestamp: new Date().toISOString(),
    areas: areas,
    testResults: testResults
  }));
  
  // Guarda en backend
  const token = localStorage.getItem('authToken');
  if (token) {
    try {
      const response = await fetch('http://localhost:5000/api/users/test-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          testResults : testResults
         })
      });
      
      if (!response.ok) {
        throw new Error('Error al guardar en backend');
      }
      
      console.log('Resultados guardados en backend');
    } catch (error) {
      console.error('Error guardando en backend:', error);
    }
  }
  
  // Redirige a resultados
  window.location.href = '../pages/resultados.html';
});
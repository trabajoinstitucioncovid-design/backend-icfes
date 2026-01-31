// Detecta el tipo de test desde el body del HTML (ej: <body data-test="matematicas">)
const testType = document.body.dataset.test;

// Respuestas correctas (Asegúrate que coincidan con tus inputs)
const correctAnswers = {
  matematicas: { q1:'1', q2:'2', q3:'1', q4:'2', q5:'1' },
  lectura:     { q1:'2', q2:'1', q3:'0', q4:'1', q5:'2' },
  ciencias:    { q1:'1', q2:'2', q3:'0', q4:'0', q5:'0' },
  ingles:      { q1:'0', q2:'2', q3:'1', q4:'3', q5:'0' },
  sociales:    { q1:'0', q2:'2', q3:'0', q4:'0', q5:'0' }
};

const form = document.getElementById('icfes-form');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const answers = correctAnswers[testType];
    if (!answers) {
      alert("Error de configuración: No se encontró la hoja de respuestas para este test.");
      return;
    }

    let correctas = 0;
    // Verifica 5 preguntas (q1 a q5)
    for (let i = 1; i <= 5; i++) {
      const selected = document.querySelector(`input[name="q${i}"]:checked`);
      if (selected && selected.value === answers[`q${i}`]) {
        correctas++;
      }
    }

    const porcentaje = Math.round((correctas / 5) * 100);

    // Guardar en LocalStorage
    const stored = localStorage.getItem('icfesResults');
    const icfesResults = stored ? JSON.parse(stored) : {};
    
    icfesResults[testType] = porcentaje;
    
    localStorage.setItem('icfesResults', JSON.stringify(icfesResults));

    alert(`Has completado la prueba.\nPuntaje: ${porcentaje}%`);

    // REDIRECCIÓN FINAL: Vuelve al Hub central
   window.location.href = '../pages/test-icfes.html';
  });
}
document.addEventListener('DOMContentLoaded', () => {
    
    const wrapper = document.getElementById('cards-wrap');
    const adviceText = document.getElementById('advice-text');
    const resetBtn = document.getElementById('reset-icfes');

    // Configuración: Define aquí los nombres de tus archivos HTML de cada test
    const subjects = [
        { key: 'matematicas', label: 'Matemáticas', color: '#ef4444', url: '../pages/test-icfes-matematicas.html' },
        { key: 'lectura',     label: 'Lectura Crítica', color: '#f97316', url: '../pages/test-icfes-lectura.html' },
        { key: 'sociales',    label: 'Sociales y Ciudadanas', color: '#8b5cf6', url: '../pages/test-icfes-sociales.html' },
        { key: 'ciencias',    label: 'Ciencias Naturales', color: '#10b981', url: '../pages/test-icfes-ciencias.html' },
        { key: 'ingles',      label: 'Inglés', color: '#3b82f6', url: '../pages/test-icfes-ingles.html' }
    ];

    // 1. Renderizar Tarjetas
    function renderCards() {
        const raw = localStorage.getItem('icfesResults');
        const results = raw ? JSON.parse(raw) : {};
        
        if(wrapper) wrapper.innerHTML = ''; // Limpiar contenedor
        let examsTaken = 0;

        subjects.forEach(sub => {
            const score = results[sub.key]; 
            const hasScore = (score !== undefined && score !== null);
            if(hasScore) examsTaken++;

            // Crear tarjeta HTML
            const card = document.createElement('article');
            card.className = 'card';
            // Borde superior de color
            card.style.borderTop = `4px solid ${sub.color}`;

            card.innerHTML = `
                <div>
                    <h3 style="color:${sub.color}">${sub.label}</h3>
                    <div class="pct">${hasScore ? score + '%' : '--'}</div>
                    <div class="progress-bg">
                        <div style="width: ${hasScore ? score : 0}%; background-color: ${sub.color}; height:100%; transition: width 1s;"></div>
                    </div>
                </div>
                <div class="controls">
                    ${hasScore 
                        ? `<a href="${sub.url}" class="btn btn-retry">Mejorar puntaje</a>` 
                        : `<a href="${sub.url}" class="btn btn-start">Iniciar Prueba</a>`
                    }
                </div>
            `;
            
            if(wrapper) wrapper.appendChild(card);
        });

        updateAdvice(results, examsTaken);
    }

    // 2. Consejo Dinámico
    function updateAdvice(results, count) {
        if (!adviceText) return;

        if (count === 0) {
            adviceText.textContent = "Aún no has presentado ninguna prueba. ¡Elige una tarjeta arriba y comienza tu entrenamiento!";
            return;
        }

        const mat = results.matematicas || 0;
        const cie = results.ciencias || 0;
        const lec = results.lectura || 0;
        const ing = results.ingles || 0;

        if (mat >= 80 && cie >= 70) {
            adviceText.innerHTML = "🚀 <strong>Perfil STEM:</strong> Tienes grandes habilidades para Ingenierías, Tecnología o Ciencias Exactas.";
        } else if (lec >= 80) {
            adviceText.innerHTML = "⚖️ <strong>Perfil Humanístico:</strong> Tu comprensión lectora es excelente. Derecho, Psicología o Comunicación son buenas opciones.";
        } else if (ing >= 90) {
            adviceText.innerHTML = "🌍 <strong>Perfil Internacional:</strong> Tu nivel de inglés te abre puertas en Negocios Internacionales o Turismo.";
        } else if (mat < 60 && lec < 60 && cie < 60) {
            adviceText.innerHTML = "📚 <strong>Recomendación:</strong> Enfócate en repasar conceptos básicos. Intenta repetir las pruebas para afianzar conocimientos.";
        } else {
            adviceText.innerHTML = "🎓 <strong>Perfil Equilibrado:</strong> Tienes bases sólidas en varias áreas. Podrías destacar en Administración o carreras interdisciplinarias.";
        }
    }

    // 3. Botón Reset
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if(confirm("¿Estás seguro de que quieres borrar todo tu historial de pruebas?")) {
                localStorage.removeItem('icfesResults');
                renderCards();
            }
        });
    }

    // Ejecutar al cargar
    renderCards();
});
// 1. Selección de Nodos DOM
const btnGenerar = document.getElementById('btn-generar');
const quoteDisplay = document.getElementById('quote-display');
const loadingElement = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const historyList = document.getElementById('history-list');
const totalQuotes = document.getElementById('total-quotes');
const sessionCount = document.getElementById('session-count');
const favoriteCount = document.getElementById('favorite-count');

// Variables de estado
let historialFrases = [];
let frasesEnSesion = 0;
let frasesFavoritas = 0;
const MAX_HISTORIAL = 10;

// 2. Función asíncrona para obtener datos de la API
async function obtenerFraseKanye() {
    const url = 'https://api.kanye.rest/';
    
    // Mostrar estado de carga - CRITERIO: Manejo de Carga
    mostrarCargando();
    ocultarError();
    deshabilitarBoton(true);
    
    try {
        // 3. Hacer solicitud GET con fetch y await - CRITERIO: Implementación de fetch()
        const respuesta = await fetch(url);
        
        // Verificar si la respuesta es exitosa
        if (!respuesta.ok) {
            throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
        }
        
        // 4. Convertir respuesta a JSON - CRITERIO: Implementación de fetch()
        const datos = await respuesta.json();
        
        // 5. Procesar datos exitosos - CRITERIO: Actualización del DOM
        ocultarCargando();
        mostrarFrase(datos);
        agregarAlHistorial(datos);
        actualizarEstadisticas();
        
    } catch (error) {
        // 6. Manejo de errores - CRITERIO: Manejo de Errores
        ocultarCargando();
        mostrarError();
        console.error('Error al obtener frase de Kanye:', error);
    } finally {
        deshabilitarBoton(false);
    }
}

// Función para mostrar estado de carga
function mostrarCargando() {
    loadingElement.classList.remove('hidden');
    
    // Mostrar mensaje de carga en el área de la frase
    quoteDisplay.innerHTML = `
        <div class="loading-content">
            <div class="beat-spinner"></div>
            <p>Kanye está creando...</p>
        </div>
    `;
}

// Función para ocultar estado de carga
function ocultarCargando() {
    loadingElement.classList.add('hidden');
}

// Función para mostrar error
function mostrarError() {
    errorMessage.classList.remove('hidden');
    
    // Mostrar mensaje de error en el área de la frase
    quoteDisplay.innerHTML = `
        <div class="error-display">
            <i class="fas fa-exclamation-triangle"></i>
            <p>No se pudo conectar con la sabiduría de Kanye</p>
            <p style="font-size: 0.9rem; opacity: 0.7;">Intenta nuevamente</p>
        </div>
    `;
}

// Función para ocultar error
function ocultarError() {
    errorMessage.classList.add('hidden');
}

// Función para deshabilitar/habilitar botón
function deshabilitarBoton(deshabilitar) {
    btnGenerar.disabled = deshabilitar;
    if (deshabilitar) {
        btnGenerar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando...';
    } else {
        btnGenerar.innerHTML = '<i class="fas fa-star"></i> Nueva Frase Kanye';
    }
}

// Función para mostrar la frase en el DOM - CRITERIO: Actualización del DOM
function mostrarFrase(datos) {
    const fraseHTML = `
        <div class="quote-text">
            ${datos.quote}
        </div>
    `;
    
    quoteDisplay.innerHTML = fraseHTML;
}

// Función para agregar frase al historial usando createElement - CRITERIO: Actualización del DOM
function agregarAlHistorial(datos) {
    const fechaConsulta = new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Crear objeto de frase
    const frase = {
        id: Date.now(),
        quote: datos.quote,
        fecha: fechaConsulta
    };
    
    // Agregar al array de historial
    historialFrases.unshift(frase);
    frasesEnSesion++;
    
    // Limitar historial
    if (historialFrases.length > MAX_HISTORIAL) {
        historialFrases = historialFrases.slice(0, MAX_HISTORIAL);
    }
    
    // Actualizar DOM del historial
    actualizarHistorialDOM();
}

// Función para actualizar el DOM del historial - CRITERIO: Actualización del DOM
function actualizarHistorialDOM() {
    // Limpiar el contenedor
    historyList.innerHTML = '';
    
    if (historialFrases.length === 0) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-history';
        emptyDiv.innerHTML = `
            <i class="fas fa-comment"></i>
            <p>Tu historial de frases aparecerá aquí</p>
        `;
        historyList.appendChild(emptyDiv);
        return;
    }
    
    // Crear elementos para cada item del historial usando createElement
    historialFrases.forEach(frase => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.onclick = () => mostrarFraseEnPrincipal(frase);
        
        const historyQuote = document.createElement('div');
        historyQuote.className = 'history-quote';
        historyQuote.textContent = `"${frase.quote}"`;
        
        const historyDate = document.createElement('div');
        historyDate.className = 'history-date';
        historyDate.textContent = frase.fecha;
        
        // Usar appendChild para agregar elementos
        historyItem.appendChild(historyQuote);
        historyItem.appendChild(historyDate);
        
        historyList.appendChild(historyItem);
    });
}

// Función para mostrar frase del historial en la sección principal
function mostrarFraseEnPrincipal(frase) {
    const fraseHTML = `
        <div class="quote-text">
            ${frase.quote}
        </div>
    `;
    
    quoteDisplay.innerHTML = fraseHTML;
}

// Función para actualizar estadísticas
function actualizarEstadisticas() {
    totalQuotes.textContent = historialFrases.length;
    sessionCount.textContent = frasesEnSesion;
    favoriteCount.textContent = frasesFavoritas;
}

// 7. Event Listener para el botón
btnGenerar.addEventListener('click', obtenerFraseKanye);

// 8. Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    console.log('Kanye Wisdom inicializado');
    actualizarHistorialDOM();
    actualizarEstadisticas();
    
    // Cargar historial desde localStorage si existe
    const historialGuardado = localStorage.getItem('kanyeHistorial');
    if (historialGuardado) {
        historialFrases = JSON.parse(historialGuardado);
        actualizarHistorialDOM();
        actualizarEstadisticas();
    }
});

// Guardar historial en localStorage antes de cerrar
window.addEventListener('beforeunload', function() {
    localStorage.setItem('kanyeHistorial', JSON.stringify(historialFrases));
});
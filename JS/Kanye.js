const btnGenerar = document.getElementById('btn-generar');
const quoteDisplay = document.getElementById('quote-display');
const loadingElement = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const historyList = document.getElementById('history-list');
const totalQuotes = document.getElementById('total-quotes');
const sessionCount = document.getElementById('session-count');
const favoriteCount = document.getElementById('favorite-count');

let historialFrases = [];
let frasesEnSesion = 0;
let frasesFavoritas = 0;
const MAX_HISTORIAL = 10;

async function obtenerFraseKanye() {
    const url = 'https://api.kanye.rest/';
    
    mostrarCargando();
    ocultarError();
    deshabilitarBoton(true);
    
    try {
        const respuesta = await fetch(url);
        
        
        if (!respuesta.ok) {
            throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
        }
        
        const datos = await respuesta.json();
        
        ocultarCargando();
        mostrarFrase(datos);
        agregarAlHistorial(datos);
        actualizarEstadisticas();
        
    } catch (error) {
        ocultarCargando();
        mostrarError();
        console.error('Error al obtener frase de Kanye:', error);
    } finally {
        deshabilitarBoton(false);
    }
}

function mostrarCargando() {
    loadingElement.classList.remove('hidden');
    
    quoteDisplay.innerHTML = `
        <div class="loading-content">
            <div class="beat-spinner"></div>
            <p>Kanye está creando...</p>
        </div>
    `;
}

function ocultarCargando() {
    loadingElement.classList.add('hidden');
}

function mostrarError() {
    errorMessage.classList.remove('hidden');
    
    quoteDisplay.innerHTML = `
        <div class="error-display">
            <i class="fas fa-exclamation-triangle"></i>
            <p>No se pudo conectar con la sabiduría de Kanye</p>
            <p style="font-size: 0.9rem; opacity: 0.7;">Intenta nuevamente</p>
        </div>
    `;
}

function ocultarError() {
    errorMessage.classList.add('hidden');
}

function deshabilitarBoton(deshabilitar) {
    btnGenerar.disabled = deshabilitar;
    if (deshabilitar) {
        btnGenerar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando...';
    } else {
        btnGenerar.innerHTML = '<i class="fas fa-star"></i> Nueva Frase Kanye';
    }
}

function mostrarFrase(datos) {
    const fraseHTML = `
        <div class="quote-text">
            ${datos.quote}
        </div>
    `;
    
    quoteDisplay.innerHTML = fraseHTML;
}

function agregarAlHistorial(datos) {
    const fechaConsulta = new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const frase = {
        id: Date.now(),
        quote: datos.quote,
        fecha: fechaConsulta
    };
    
    historialFrases.unshift(frase);
    frasesEnSesion++;
    
    if (historialFrases.length > MAX_HISTORIAL) {
        historialFrases = historialFrases.slice(0, MAX_HISTORIAL);
    }
    
    actualizarHistorialDOM();
}

function actualizarHistorialDOM() {
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
        
        historyItem.appendChild(historyQuote);
        historyItem.appendChild(historyDate);
        
        historyList.appendChild(historyItem);
    });
}

function mostrarFraseEnPrincipal(frase) {
    const fraseHTML = `
        <div class="quote-text">
            ${frase.quote}
        </div>
    `;
    
    quoteDisplay.innerHTML = fraseHTML;
}

function actualizarEstadisticas() {
    totalQuotes.textContent = historialFrases.length;
    sessionCount.textContent = frasesEnSesion;
    favoriteCount.textContent = frasesFavoritas;
}

btnGenerar.addEventListener('click', obtenerFraseKanye);

document.addEventListener('DOMContentLoaded', function() {
    console.log('Kanye Wisdom inicializado');
    actualizarHistorialDOM();
    actualizarEstadisticas();
    
    const historialGuardado = localStorage.getItem('kanyeHistorial');
    if (historialGuardado) {
        historialFrases = JSON.parse(historialGuardado);
        actualizarHistorialDOM();
        actualizarEstadisticas();
    }
});

window.addEventListener('beforeunload', function() {
    localStorage.setItem('kanyeHistorial', JSON.stringify(historialFrases));
});
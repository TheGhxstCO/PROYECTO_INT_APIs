// 1. Selección de Nodos DOM
const botonConsultar = document.getElementById('btn-consultar');
const cardDisplay = document.getElementById('card-display');
const loadingElement = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const historyContainer = document.getElementById('history-container');

let consultasRealizadas = 0;
let historialConsultas = [];

async function obtenerCartaTarot() {
    const url = 'https://tarotapi.dev/api/v1/cards/random';

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
        mostrarCarta(datos);
        agregarAlHistorial(datos);
        consultasRealizadas++;
        
    } catch (error) {
        ocultarCargando();
        mostrarError();
        console.error('Error al consultar el oráculo:', error);
    } finally {
        deshabilitarBoton(false);
    }
}

function mostrarCargando() {
    cardDisplay.innerHTML = '';
    
    loadingElement.classList.remove('hidden');
    
    const mensajeCarga = document.createElement('div');
    mensajeCarga.className = 'loading-content';
    mensajeCarga.innerHTML = `
        <div class="crystal-spinner"></div>
        <p>Consultando a los astros...</p>
    `;
    cardDisplay.appendChild(mensajeCarga);
}

function ocultarCargando() {
    loadingElement.classList.add('hidden');
}

function mostrarError() {
    errorMessage.classList.remove('hidden');

    cardDisplay.innerHTML = `
        <div class="error-display">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #FECACA; margin-bottom: 1rem;"></i>
            <p>El universo no responde en este momento</p>
            <p style="font-size: 0.9rem; opacity: 0.7;">Intenta nuevamente cuando los astros estén alineados</p>
        </div>
    `;
}

function ocultarError() {
    errorMessage.classList.add('hidden');
}

function deshabilitarBoton(deshabilitar) {
    botonConsultar.disabled = deshabilitar;
    if (deshabilitar) {
        botonConsultar.innerHTML = '<i class="fas fa-hourglass-half"></i> Consultando...';
    } else {
        botonConsultar.innerHTML = '<i class="fas fa-star-and-crescent"></i> Consultar el Oráculo';
    }
}

function mostrarCarta(datosCarta) {
    const carta = datosCarta.cards[0];
    
    const cartaHTML = `
        <div class="tarot-card revealed">
            <img src="${carta.image}" alt="${carta.name}" class="card-image" 
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDE4MCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxODAiIGhlaWdodD0iMzAwIiByeD0iMTAiIGZpbGw9InVybCgjZ3JhZGllbnQwX2xpbmVhcl84NV8xNDcpIi8+CjxyZWN0IHg9IjUiIHk9IjUiIHdpZHRoPSIxNzAiIGhlaWdodD0iMjkwIiByeD0iOCIgZmlsbD0idXJsKCNncmFkaWVudDFfbGluZWFyXzg1XzE0NykiLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQwX2xpbmVhcl84NV8xNDciIHgxPSIwIiB5MT0iMCIgeDI9IjE4MCIgeTI9IjMwMCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjNkQyOEQ5Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzRDMUQ5NSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50MV9saW5lYXJfODVfMTQ3IiB4MT0iMCIgeTE9IjAiIHgyPSIxODAiIHkyPSIzMDAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0Y1OUUwQiIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGQkJGMjQiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNnB4Ij5UQVJPPC90ZXh0Pgo8L3N2Zz4K'">
        </div>
        <div class="card-name">${carta.name}</div>
        <div class="card-type">${carta.type}</div>
        <div class="card-meaning">"${carta.meaning_up}"</div>
        <div class="card-desc">${carta.desc}</div>
    `;
    
    cardDisplay.innerHTML = cartaHTML;
}

function agregarAlHistorial(datosCarta) {
    const carta = datosCarta.cards[0];
    const fechaConsulta = new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const consulta = {
        id: Date.now(),
        nombre: carta.name,
        tipo: carta.type,
        significado: carta.meaning_up,
        fecha: fechaConsulta
    };
    
    historialConsultas.unshift(consulta);
    
    if (historialConsultas.length > 10) {
        historialConsultas = historialConsultas.slice(0, 10);
    }
    
    actualizarHistorialDOM();
}

function actualizarHistorialDOM() {
    if (historialConsultas.length === 0) {
        historyContainer.innerHTML = `
            <div class="empty-history">
                <i class="fas fa-feather-alt"></i>
                <p>Tus consultas aparecerán aquí</p>
            </div>
        `;
        return;
    }
    
    const historialHTML = historialConsultas.map(consulta => `
        <div class="history-item">
            <div class="history-name">${consulta.nombre}</div>
            <div class="history-type">${consulta.tipo}</div>
            <div class="history-meaning">"${consulta.significado}"</div>
            <div class="history-date">${consulta.fecha}</div>
        </div>
    `).join('');
    
    historyContainer.innerHTML = historialHTML;
}

botonConsultar.addEventListener('click', obtenerCartaTarot);

document.addEventListener('DOMContentLoaded', function() {
    console.log('Oráculo del Tarot inicializado');
    actualizarHistorialDOM();
    
    const elementos = document.querySelectorAll('.card-section');
    elementos.forEach((elemento, index) => {
        elemento.style.animation = `fadeInDown 0.8s ease ${index * 0.2}s both`;
    });
});

document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
        const tarotCard = e.target.closest('.tarot-card');
        if (tarotCard) {
            tarotCard.innerHTML = '<div class="card-back">✦</div>';
        }
    }
}, true);
// Estado
let history = [];
let soundOn = true;

// Traducciones
const stats = {
    'hp': 'PS',
    'attack': 'Ataque',
    'defense': 'Defensa',
    'special-attack': 'At. Especial',
    'special-defense': 'Def. Especial',
    'speed': 'Velocidad'
};

// Sonidos
const playSound = (type) => {
    if (!soundOn) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'search') {
        osc.frequency.value = 600;
        gain.gain.value = 0.1;
        osc.start();
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'success') {
        osc.frequency.value = 523.25;
        gain.gain.value = 0.15;
        osc.start();
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.stop(ctx.currentTime + 0.4);
    } else {
        osc.type = 'sawtooth';
        osc.frequency.value = 200;
        gain.gain.value = 0.1;
        osc.start();
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.stop(ctx.currentTime + 0.3);
    }
};

// Controles
document.getElementById('soundBtn').onclick = () => {
    soundOn = !soundOn;
    const btn = document.getElementById('soundBtn');
    btn.textContent = soundOn ? '🔊' : '🔇';
    btn.className = soundOn ? 'btn-icon active' : 'btn-icon inactive';
    localStorage.soundOn = soundOn;
    if (soundOn) playSound('success');
};

document.getElementById('themeBtn').onclick = () => {
    document.body.classList.toggle('dark');
    const btn = document.getElementById('themeBtn');
    btn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
    localStorage.theme = document.body.classList.contains('dark') ? 'dark' : 'light';
};

// Historial
const updateHistory = (name) => {
    history = [name, ...history.filter(h => h !== name)].slice(0, 5);
    localStorage.history = JSON.stringify(history);
    
    document.getElementById('history').innerHTML = history.length
        ? history.map(h => `<div class="history-item" onclick="searchHistory('${h}')">${h}</div>`).join('')
        : '<span style="color: #95a5a6; font-size: 0.85em; font-style: italic;">Sin búsquedas previas</span>';
};

const searchHistory = (name) => {
    document.getElementById('input').value = name;
    search();
};

// Búsqueda
const search = async () => {
    const input = document.getElementById('input').value.trim();
    
    if (!input) {
        showError('El campo está vacío.', 'Ingresa un nombre (ej: pikachu) o número (ej: 25).');
        return;
    }

    document.getElementById('result').innerHTML = '<div class="loading"><div class="spinner"></div><div style="color: #3498db; font-weight: 500;">Buscando pokémon...</div></div>';
    playSound('search');

    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${input.toLowerCase()}`);
        if (!res.ok) throw new Error();
        
        const data = await res.json();
        showPokemon(data);
        updateHistory(data.name);
        playSound('success');
    } catch {
        if (!isNaN(input) && (input > 898 || input < 1)) {
            showError(`El número ${input} no existe.`, 'Usa números entre 1 y 898.');
        } else {
            showError(`No se encontró "${input}".`, 'Verifica la ortografía.');
        }
        playSound('error');
    }
};

const randomPokemon = () => {
    document.getElementById('input').value = Math.floor(Math.random() * 898) + 1;
    search();
};

const showError = (msg, tip) => {
    document.getElementById('result').innerHTML = `
        <div class="error">
            <div style="font-weight: 600; margin-bottom: 8px;">Error de búsqueda</div>
            <div>${msg}</div>
            <div style="margin-top: 10px; font-size: 0.9em; opacity: 0.7;">💡 ${tip}</div>
        </div>
    `;
};

const showPokemon = (d) => {
    const types = d.types.map(t => `<span class="type type-${t.type.name}">${t.type.name}</span>`).join('');
    const statsList = d.stats.map(s => `
        <div class="stat">
            <div class="stat-name">${stats[s.stat.name] || s.stat.name}</div>
            <div class="stat-bar">
                <div class="stat-fill" style="width: ${(s.base_stat/255)*100}%">
                    <span class="stat-value">${s.base_stat}</span>
                </div>
            </div>
        </div>
    `).join('');

    document.getElementById('result').innerHTML = `
        <div class="pokemon-card">
            <img src="${d.sprites.other['official-artwork'].front_default || d.sprites.front_default}" alt="${d.name}">
            <div class="pokemon-name">${d.name}</div>
            <div class="pokemon-id">#${d.id}</div>
            <div class="types">${types}</div>
            <div class="stats">
                <h3>Estadísticas</h3>
                ${statsList}
            </div>
        </div>
    `;
};

// Enter para buscar
document.getElementById('input').onkeypress = (e) => {
    if (e.key === 'Enter') search();
};

// Cargar datos guardados
if (localStorage.theme === 'dark') {
    document.body.classList.add('dark');
    document.getElementById('themeBtn').textContent = '☀️';
}
if (localStorage.soundOn === 'false') {
    soundOn = false;
    document.getElementById('soundBtn').textContent = '🔇';
    document.getElementById('soundBtn').className = 'btn-icon inactive';
}
if (localStorage.history) {
    history = JSON.parse(localStorage.history);
    updateHistory(history[0]);
}
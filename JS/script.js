document.addEventListener("DOMContentLoaded", () => {
  const contenido = document.getElementById("contenido");
  const loader = document.getElementById("loader");
  const container = document.getElementById("fact-container") || document.getElementById("api-container");
  const nuevoDatoBtn = document.getElementById("nuevoDato");
  const apiType = contenido.dataset.api;

  const mostrarCarga = () => {
    loader.style.display = "block";
    if (container) container.classList.add("hidden");
  };

  const ocultarCarga = () => {
    loader.style.display = "none";
    if (container) container.classList.remove("hidden");
  };

  // --- API 1: SANTIAGO A ---
  async function cargarUselessFact() {
    mostrarCarga();
    try {
      const respuesta = await fetch("https://uselessfacts.jsph.pl/api/v2/facts/random");
      if (!respuesta.ok) throw new Error("Error en la solicitud");
      const data = await respuesta.json();
      document.getElementById("fact-text").textContent = data.text || "No se pudo obtener un dato inútil.";
    } catch (error) {
      document.getElementById("fact-text").textContent = "Error al cargar el dato.";
    } finally {
      ocultarCarga();
    }
  }

  // --- API 2: SANTIAGO Z (REEMPLAZAR) ---

async function cargarKanye() {
  mostrarCarga(); // ✅ Ya existe esta función arriba
  try {
    const respuesta = await fetch("https://api.kanye.rest/");
    if (!respuesta.ok) throw new Error("Error en la solicitud");
    const data = await respuesta.json();

    document.getElementById("kanye-quote").textContent = `"${data.quote}"`;
  } catch (error) {
    console.error("Error al cargar Kanye API:", error);
    document.getElementById("kanye-quote").textContent = "❌ No se pudo cargar la frase.";
  } finally {
    ocultarCarga();
  }
}

  // --- API 3: SAMUEL M (REEMPLAZAR) ---
  async function cargarCoffee() {
    mostrarCarga();
    try {
      const respuesta = await fetch("https://api.sampleapis.com/coffee/hot");
      if (!respuesta.ok) throw new Error("Error al obtener los cafés");
      const data = await respuesta.json();

      const random = Math.floor(Math.random() * data.length);
      const cafe = data[random];

      document.getElementById("coffee-name").textContent = cafe.title;
      document.getElementById("coffee-desc").textContent = cafe.description || "Sin descripción disponible.";
      document.getElementById("coffee-img").src = cafe.image || "";
    } catch (error) {
      document.getElementById("coffee-name").textContent = "Error al cargar café.";
    } finally {
      ocultarCarga();
    }
  }

  // --- API 4: JUAN DIEGO C (REEMPLAZAR) ---
  async function cargarAdvice() {
    mostrarCarga();
    try {
      const respuesta = await fetch("https://api.adviceslip.com/advice");
      const data = await respuesta.json();
      document.getElementById("advice-text").textContent = `"${data.slip.advice}"`;
    } catch (error) {
      document.getElementById("advice-text").textContent = "No se pudo obtener el consejo.";
    } finally {
      ocultarCarga();
    }
  }

  // --- Seleccionar API según la página ---
  switch (apiType) {
    case "useless":
      cargarUselessFact();
      nuevoDatoBtn.addEventListener("click", cargarUselessFact);
      break;
    case "dog":
      cargarDogImage();
      nuevoDatoBtn.addEventListener("click", cargarDogImage);
      break;
    case "rickmorty":
      cargarRickMorty();
      nuevoDatoBtn.addEventListener("click", cargarRickMorty);
      break;
    case "advice":
      cargarAdvice();
      nuevoDatoBtn.addEventListener("click", cargarAdvice);
      break;
    default:
      console.error("No se encontró el tipo de API en data-api");
  }
});
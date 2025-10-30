document.addEventListener("DOMContentLoaded", () => {
  const apiType = document.querySelector("main")?.dataset.api;

  switch (apiType) {
    case "useless":
      cargarUselessFact();
      break;
    case "imdb":
      cargarIMDB();
      break;
    case "kanye":
      cargarKanye();
      break;
    default:
      console.error("No se encontró el tipo de API en data-api");
  }

  // Botones
  const btnVolver = document.getElementById("btn-volver");
  const btnNuevo = document.getElementById("btn-nuevo");

  if (btnVolver) btnVolver.addEventListener("click", () => window.location.href = "index.html");
  if (btnNuevo) btnNuevo.addEventListener("click", () => {
    if (apiType === "useless") cargarUselessFact();
    if (apiType === "imdb") cargarIMDB();
    if (apiType === "kanye") cargarKanye();
  });
});

// --- API 2: SANTIAGO Z (REEMPLAZAR) ---
async function cargarIMDB() {
  mostrarCarga();
  try {
    // Llamada a la API (esta devuelve información sobre una película específica)
    const respuesta = await fetch("https://imdb.iamidiotareyoutoo.com/search?tt=tt2250912");
    if (!respuesta.ok) throw new Error("Error al obtener los datos");

    const data = await respuesta.json();

    // Si el formato cambia, adaptamos según la respuesta:
    const movie = data[0] || data;

    document.getElementById("movie-title").textContent = movie.title || "Película desconocida";
    document.getElementById("movie-description").textContent = movie.description || "Sin descripción disponible.";
    document.getElementById("movie-year").textContent = movie.year || "Desconocido";
    document.getElementById("movie-runtime").textContent = movie.runtime || "No especificado";
    document.getElementById("movie-poster").src =
      movie.image || "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
  } catch (error) {
    console.error("Error al cargar IMDB API:", error);
    document.getElementById("movie-title").textContent = "❌ Error al cargar los datos.";
  } finally {
    ocultarCarga();
  }
}
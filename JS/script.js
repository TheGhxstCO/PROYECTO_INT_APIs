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

  switch (apiType) {
    case "useless":
      cargarUselessFact();
      nuevoDatoBtn.addEventListener("click", cargarUselessFact);
      break;
  }
});
/* Desarrollaremos un frontal que realice consumos a una API (de libre elección)
 y que permita definir unos criterios para devolver unos resultados u otros.
La idea es aplicar todo lo que hemos aprendido en cuanto a FRONT se refiere, 
así que desarrollaremos un HTML con sus etiquetas bien identificadas y contextualizadas.
Recordad reglas de estilo, patrones de diseño, buenas prácticas, manejo del DOM 
(creación, manipulación y eliminación de elementos HTML a través de JS).
Manejaremos el DOM para que exista un control de errores que se muestren en según qué casos al usuario:
	- Mostraremos resultados si existen, mostraremos  'No resultados' en caso de que no.
	- Realizaremos un uso correcto del fetch que permita definir un control de errores que
	 nos sirva para administrar los estados de la petición y actuar en consecuencia.
	- En los momentos de espera, deberemos mostrar un mensaje o en su defecto un spinner 
	para que el usuario sepa que está cargando la petición.
Ojo, no nos volvamos locos creando dinámicamente todos los elementos HTML, a veces es mejor 
simplemente definirlos y mostrarlos cuando sea oportuno. */
// dd7843d8eamshbea650910592f61p181e08jsn287bc1a1be2a
// 9619b50980msh4f654765a209c31p10199bjsn4c530edb9e54


function app() {
  // form select
  document
    .querySelector("#categorias")
    .addEventListener("change", categoriaSeleccionada);

  // rederizado
  const resultado = document.querySelector("#resultado");
  const spinner = document.querySelector("#spinner");

  async function categoriaSeleccionada(e) {
    const categoria = e.target.value;
    console.log(categoria);

    // muestra spinner antes de la carga de datos

    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "dd7843d8eamshbea650910592f61p181e08jsn287bc1a1be2a",
        "X-RapidAPI-Host": "keto-diet.p.rapidapi.com",
      },
    };

    spinner.removeAttribute("hidden");
    fetch(`https://keto-diet.p.rapidapi.com/?category=${categoria}`, options)
      .then((response) => response.json())
      .then((result) => {
        spinner.setAttribute("hidden", "");
        mostrarCards(result);
      })
      .catch((err) => console.log(err));
  }

  function mostrarCards(result = []) {
    //   console.log(result)
    result.forEach((res) => {
      console.log(res);
      const { image, recipe, directions_step_1 } = res;

      const card = document.createElement("div");
      card.classList.add("card");

      const imagen = document.createElement("img");
      imagen.src = image;

      const cardBody = document.createElement("div");
      cardBody.classList.add("card-body");

      const content = document.createElement("p");
      content.textContent = directions_step_1;

      const title = document.createElement("h3");
      title.textContent = recipe;

      // pintado
      card.appendChild(imagen);
      card.appendChild(cardBody); // div
      cardBody.appendChild(title); // h5
      cardBody.appendChild(content); //p
      resultado.appendChild(card); //div
    });
  }
}

document.addEventListener("DOMContentLoaded", app);
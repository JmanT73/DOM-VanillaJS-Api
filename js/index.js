// dd7843d8eamshbea650910592f61p181e08jsn287bc1a1be2a
// 9619b50980msh4f654765a209c31p10199bjsn4c530edb9e54

// renders
const resultado = document.querySelector("#resultado");
const resultCard = document.querySelector('.result-card')
const spinner = document.querySelector("#spinner");
const modal = new bootstrap.Modal('#modal', {}) 

const findUser = () => {
  const user = localStorage.getItem('Usuario')

  document.querySelector('.divLogin').style.display = user ? 'none' : 'block';
  document.querySelector('.divLogout').style.display = user ? 'flex' : 'none'; 

  if(user){
    document.querySelector('.welcome').innerText = `Welcome ${user}`
    document.querySelector('.btn-logout').innerText = 'Logout'
    document.querySelector('.btn-logout').classList.remove('d-none')
  }
}

function register(e) {
  e.preventDefault()
  const user = document.querySelector('#name').value

  console.log(user)
  
  localStorage.setItem('Usuario', JSON.stringify(user))

  document.querySelector('.divLogin').style.display = user ? 'none' : 'block';
  document.querySelector('.divLogout').style.display = user ? 'flex' : 'none'; 
  document.querySelector('.welcome').innerText = `Welcome ${user}`
  document.querySelector('.btn-logout').innerText = 'Logout'
  document.querySelector('.btn-logout').classList.remove('d-none')  
}

const logout = () => {
  localStorage.removeItem('Usuario')
  location.reload()
}

window.addEventListener("load", () => {

  findUser()
  
  // form user
  document.querySelector('#register').addEventListener('submit', register)
  document.querySelector('.btn-logout').addEventListener('click', logout)

  
  // form select
  document.querySelector("#categorias").addEventListener("change", categoriaSeleccionada);
  

  /* ------------------ CATEGORY API ENDPOINTS --------------------*/
  function categoriaSeleccionada(e) {
    const categoria = e.target.value;
    console.log(categoria);

    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "9619b50980msh4f654765a209c31p10199bjsn4c530edb9e54",
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
  /* ---------------------- CARDS --------------------------------- */
  function mostrarCards(result = []) {
    limpiarHtml(resultCard)
    limpiarHtml(resultado);
    console.log(result);

    // pinta si array result viene vacío o no
    const emptyArr = document.createElement("h2");
    emptyArr.textContent = result.length
      ? "Resultados"
      : "No existen resultados";
    resultCard.appendChild(emptyArr);
    
    result.forEach((res) => {
      console.log(res);
      const { id, image, recipe, directions_step_1 } = res;

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

      const button = document.createElement("button");
      button.textContent = "see more..";

      // pintado de la card
      card.appendChild(imagen); // img
      card.appendChild(cardBody); // div
      cardBody.appendChild(title); // h5
      cardBody.appendChild(content); //p
      cardBody.appendChild(button); // button
      resultado.appendChild(card); //div

      button.onclick = () => {
        console.log(id);
        singleRecipe(id);
      };
    });
  }

  /* --------------- SINGLE RECIPE API ENDPOINTS ---------------*/
  function singleRecipe(id) {
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "9619b50980msh4f654765a209c31p10199bjsn4c530edb9e54",
        "X-RapidAPI-Host": "keto-diet.p.rapidapi.com",
      },
    };
    spinner.removeAttribute("hidden");
    fetch(`https://keto-diet.p.rapidapi.com/?id=${id}`, options)
      .then((response) => response.json())
      .then((response) => {
        spinner.setAttribute("hidden", "");
        mostrarReceta(response[0])})
      .catch((err) => console.error(err));
  }

  // limpia los resultados previos para mostras los nuevos
  // RECIBE UNA REFERENCIA DEL ELEMENTO CONCRETOD DEL DOM A LIMPIAR
  function limpiarHtml(selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  }

  /* ----------------- MODAL RECETA INDIVIDUAL -----------------*/
  function mostrarReceta(receta){
    console.log(receta)
    const { id, image, recipe } = receta

    // para renderizar contenido en el modal
    const modalTitle = document.querySelector('.modal-title')
    const modalBody = document.querySelector('.modal-body')
    const modalFooter = document.querySelector('.modal-footer')

    // borro después de crear para que no se duplique cuando añado hijos
    limpiarHtml(modalFooter)

    modalTitle.textContent = recipe
    modalBody.innerHTML = `
      <img class="img-fluid" src="${image}" width="300px" height="150px"/>
      <h5>Preparación</h5>

    `
    // creo lista desordenada
    const listGroup = document.createElement('ul')
    listGroup.classList.add('list-group')

    // muestro ingredientes e instrucciones en el modal
    for (let i = 1; i<10; i++){
      if (receta[`directions_step_${i}`]) {
        const instrucciones = receta[`directions_step_${i}`]
        const ingredientes = receta[`ingredient_${i}`]

        const instruIngreList = document.createElement('li')
        instruIngreList.classList.add('list-group-item') // clase de bootstrap
        instruIngreList.textContent = `${instrucciones} - ${ingredientes}`

        // console.log(`${instrucciones} - ${ingredientes} `)
        // agrego los li a la ul
        listGroup.appendChild(instruIngreList)
      }
    }
    
    // agrego la lista al modal
    modalBody.appendChild(listGroup)
    
    // botón agregar a FAVORITOS
    const btnFav = document.createElement('button')
    btnFav.classList.add('btn', 'btn-danger')
    btnFav.textContent = existeFavoritos(id) ? 'delete from Favorites' : 'add to Favorites'

    modalFooter.appendChild(btnFav)
    
    // muestro el modal
    modal.show()
    
    btnFav.onclick = function() { 

      // console.log(existeFavoritos(id))
      if(existeFavoritos(id)) {
        eleminarFavoritos(id)
        btnFav.textContent = 'add to Favorites' // actualiza pintado 
        return
      } else {
        agregarFavoritos({
          id, 
          imagen: image, 
          recipe
        }) 
        btnFav.textContent = 'delete from Favorites' // actualiza pintado
      }
    }

    // localStorage
    function agregarFavoritos(receta) {
      //console.log('agregando...', receta)
      /* ?? nullish coalescing => devuelve el primer argumento cuando este 
        no es null ni undefined. En caso contrario, devuelve el segundo. */
      const favoritos = JSON.parse(localStorage.getItem('Favoritos')) ?? [] 
      localStorage.setItem('Favoritos', JSON.stringify([...favoritos, receta]))
    }

    // devuelve true si la receta ya esta añadido a favoritos
    function existeFavoritos (id){
      const favoritos = JSON.parse(localStorage.getItem('Favoritos')) ?? []
      return favoritos.some(favorito => favorito.id === id)
    }

    // eliminar elemento de favoritos
    const eleminarFavoritos = (id) => {
      const favoritos = JSON.parse(localStorage.getItem('Favoritos')) ?? [] 
      const nuevoFavoritos = favoritos.filter(favorito => favorito.id !== id)
      localStorage.setItem('Favoritos', JSON.stringify(nuevoFavoritos))
    }
  }
});

//document.addEventListener("DOMContentLoaded", app);
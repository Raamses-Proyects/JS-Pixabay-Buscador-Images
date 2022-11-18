// Variables
const formulario = document.querySelector('.formulario');
const maxImagenesPorPagina = 30; 
let paginaActual = 1;
let busqueda;


// Eventos
formulario.addEventListener('submit', validarBusqueda);
const busquedaTexto = document.querySelector('.formulario__texto');
busquedaTexto.addEventListener('change', (e) => {
    busqueda = e.target.value;
});


// Funciones
function validarBusqueda(e) {
    e.preventDefault();
    if(busqueda === '') {
        alerta('Tiene que ingresar un termino de busqueda', 'error');
        return;
    }
    consultarAPI(busqueda);
}
function consultarAPI(busqueda) {
    const key = '27317106-ed8f65477b48bc3b931a72a0f';
    const url = `https://pixabay.com/api/?key=${key}&q=${busqueda}&per_page=${maxImagenesPorPagina}&page=${paginaActual}`;
    fetch(url)
        .then( respuesta => respuesta.json() )
        .then( datosAPI => {
            cardsHTML(datosAPI);
            paginacionHTML(datosAPI.totalHits);
        } )
        .catch( error => console.error(error) )
}
function cardsHTML(datosAPI) {
    const imagenes = document.querySelector('.imagenes');
    limpiarHTML(imagenes);

    // Creando los cards de las imagenes
    const principal = document.querySelector('.imagenes');
    datosAPI.hits.forEach(datos => {
        const { likes, pageURL, previewURL, tags, views } = datos;

        // Contenedor principal
        const card = document.createElement('div');
        card.classList.add('imagen');

        // Imagen
        const img = document.createElement('img');
        img.classList.add('imagen__img');
        img.src = previewURL;
        img.alt = `Imagen de ${tags}`;

        // Div Contenido
        const datosImagen = document.createElement('div');
        datosImagen.classList.add('imagen__contenido');
        
        // Me gusta
        const textoMeGusta = document.createElement('p');
        textoMeGusta.classList.add('imagen__texto');
        textoMeGusta.textContent = likes;
        const spanMeGusta = document.createElement('span');
        spanMeGusta.classList.add('imagen__span');
        spanMeGusta.textContent = ' Me gusta';
        textoMeGusta.appendChild(spanMeGusta);
        
        // Vistos
        const textoVistos = document.createElement('p');
        textoVistos.classList.add('imagen__texto');
        textoVistos.textContent = views;
        const spanVistos = document.createElement('span');
        spanVistos.classList.add('imagen__span');
        spanVistos.textContent = ' Veces vista';
        textoVistos.appendChild(spanVistos);

        // Enlace
        const enlace = document.createElement('a');
        enlace.classList.add('imagen__enlace');
        enlace.target = '_blank';
        enlace.rel = 'noopener noreferrer';
        enlace.href = pageURL;
        enlace.textContent = 'Ver imagen';

        // Agregando a su contenedor
        datosImagen.appendChild(textoMeGusta);
        datosImagen.appendChild(textoVistos);
        datosImagen.appendChild(enlace);
        
        // Agregando al contenedor principal
        card.appendChild(img);
        card.appendChild(datosImagen);
        principal.appendChild(card);
    });
}
function paginacionHTML(totalHits) {
    // Obteniendo el número de páginas
    const totalImagenes = totalHits;
    const paginas = Math.ceil(totalImagenes / maxImagenesPorPagina);

    // Contenedor de paginaciones
    const paginacionDiv = document.querySelector('.paginacion');
    limpiarHTML(paginacionDiv);
    
    // Creando paginación
    for(let i = 1; i <= paginas; i++) {
        const button = document.createElement('button');
        button.classList.add('paginacion__button');
        button.setAttribute('data-pagina', i);
        button.type = 'button';
        button.textContent = i;
        button.onclick = () => {
            paginaActual = i;
            consultarAPI(busqueda);
        }
        paginacionDiv.appendChild(button);
    }
}


// Helpers
function alerta(mensaje, tipo) {
    const existe = document.querySelectorAll('.alerta');
    if(existe.length === 0) {
        const contenedorAlerta = document.createElement('div');
        contenedorAlerta.classList.add('alerta');
        const texto = document.createElement('p');
        texto.classList.add('alerta__texto');
        texto.textContent = mensaje;
        contenedorAlerta.appendChild(texto);
        if( tipo === 'error' ) {
            contenedorAlerta.classList.add('error');
        }
        else {
            contenedorAlerta.classList.add('correcto')
        }
    
        // Agregando al HTML
        formulario.appendChild(contenedorAlerta);
        
        // Eliminando
        setTimeout(() => {
            contenedorAlerta.remove();
        }, 3000);
    }
}
function limpiarHTML(elemento) {
    while(elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }
}

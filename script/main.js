//Asumimos que la pagina de entrada es 0
let currentPage = 0;

let s1 = document.getElementById("section1");
let s2 = document.getElementById("section2");
let s3 = document.getElementById("section3");
let botones = document.getElementsByClassName("menuButton");
const playerBoards = document.getElementsByClassName('boxText');


//Creamos funcion para cambiar de pagina que tendra dos posible valores ( 0 para retroceder , 1 para avanzar)
//Dado que tenemos 3 secciones los valores son entre 0-2 pero 

function changePage(option) {

    switch (option) {
        case 0:
            currentPage--;
            changeDom();
            break;

        case 1:
            currentPage++;
            changeDom();
            break;

        default:
            break;
    }


}
//Funcion que se ocupa de actualizar el DOM
//Dependiendo del valor de currentPage, dejara el resto de secciones en display:none para ello creo la clase con display none en css
// De tal manera siempre que queramos modificar visibilidad de una capa, añadimos o quitamos dicha clase
function changeDom() {

    switch (currentPage) {
        case 0:
            if (!s2.classList.contains("noVisibility")) {
                s2.classList.add("noVisibility");
            }
            if (!s3.classList.contains("noVisibility")) {
                s3.classList.add("noVisibility");
            }
            s1.classList.remove("noVisibility");
            break;

        case 1:
            if (!s1.classList.contains("noVisibility")) {
                s1.classList.add("noVisibility");
            }
            if (!s3.classList.contains("noVisibility")) {
                s3.classList.add("noVisibility");
            }
            s2.classList.remove("noVisibility");
            break;

        case 2:
            if (!s1.classList.contains("noVisibility")) {
                s1.classList.add("noVisibility");
            }
            if (!s2.classList.contains("noVisibility")) {
                s2.classList.add("noVisibility");
            }
            s3.classList.remove("noVisibility");
            break;

        default:
            break;

    }

}

/* ------- Funcionalidades Section 1 -------- */

//Acceso a input de section 1.
let valores = document.getElementsByClassName("text");
//De esta manera detectamos el evento y lo recogemos en e para comprobar el key code
//Aqui el Enter en este elemento añadira un nuevo player
valores[0].addEventListener("keydown", function(e) {
    if (e.keyCode === 13) {
        addPlayer();
    }
})

//Funcion que devuelve array de usuarios en base a archivo .txt seleccionado.

function getPlayersByFile(e) {
    //Cogemos fichero seleccionado
    let file = e.target.files[0];
    if (!file) {
        //En caso de que el fichero no exista salimos.
        return;
    }
    //Usamos file reader para acceder al archivo
    let reader = new FileReader();
    //Un controlador para el evento load. Este evento se activa cada vez que la operación de lectura se ha completado satisfactoriamente.
    reader.onload = function(e) {
            //en .result encontramos la string resultante de leer el archivo.
            let content = e.target.result;
            //Parto por saltos de linea los nombres para recibirlos como array
            let arrGenerado = content.split(/\r?\n/g);
            //Tenemos la variable arrGenerado con los players del .txt para su futuro uso.
            //De momento dejamos en log el array
            for (let i = 0; i < arrGenerado.length; i++) {
                addPlayer(arrGenerado[i]);

            }

        }
        //Se le pasa archivo a leer, si lo lee correctamente haria trigger en el .onload definido anteriormente.
    reader.readAsText(file);
    document.getElementById("inputF").value = "";
}

//Añadimos Listener onChange para el input
document.getElementById('inputF').addEventListener('change', getPlayersByFile, false);

//Este array sera el que contendra todos los nombre, debe ser declarado en el cuerpo
//dado que sera usado en las section 2 y 3
let players = [];

function addPlayer(aux = "") {
    //Borramos el texto predefinido en el tablero
    if (players.length < 1) {
        playerBoards[0].innerText = "";
    }
    let valor = "";
    if (aux.length == 0) {

        valor = valores[0].value;

    } else {

        valor = aux;
    }
    //Recibimos el valor del input y lo introducimos a players

    //Comprobamos el tamaño del nombre para evitar missclick
    if (valor.length < 2) {
        return 'Nombre no valido'
    }
    players.push(valor);

    //IMPORTANTE modifico creacion de elementos en base a nuevo diseño.
    //Necesaria estructura <div class="player"><p>$NAME</p><span>X</span></div>

    //Se crea div contenedor de la card
    let container = document.createElement('div');
    container.classList.add("player");

    //Se crea P para contener el nombre.
    let player = document.createElement('p');
    //Convertimos el valor a un textNode y creamos una nueva etiqueta para juntar ambos
    valor = document.createTextNode(valor);
    player.appendChild(valor);
    //Añadimos atributos a nuestras etiquetas
    player.setAttribute("onclick", "modifyPlayer(this)");
    //player.setAttribute("class", "mod"); Dejo comentado por si necesitamos añadir clase en p en un futuro

    //Se crea span
    let close = document.createElement("span");
    close.innerHTML = "X";
    close.setAttribute("onclick", "removePlayer(this)");

    //Construccion de card con elementos anteriores
    container.appendChild(player);
    container.appendChild(close);

    //Agregamos el elemento al div boxText de la section 1
    playerBoards[0].appendChild(container);
}

//Recoge el valor, lo busca en el array y lo sobreescribe mas tarde
function modifyPlayer(player) {

    if (!player.isContentEditable) {
        let valor = player.textContent;
        var arrayNumber = players.indexOf(valor);
        player.setAttribute("contentEditable", "true")

        //Aqui tendremos el valor postcambio
        if (player.isContentEditable) {

            //Evento que detectara si el usuario pulsa ENTER
            player.addEventListener("keydown", function(e) {
                if (e.keyCode === 13) {
                    player.removeAttribute("contentEditable")
                    valor = player.textContent;
                    players[arrayNumber] = valor;
                }
            })

            //Evento que controlara el valor si el elemento pierde el foco
            player.addEventListener('blur', function(e) {
                player.addEventListener
                player.removeAttribute("contentEditable")
                valor = player.textContent;
                players[arrayNumber] = valor;
            })
        }
    }
}


//Borra al player
function removePlayer(player) {
    let pValue = player.parentNode.firstChild.innerHTML;
    if (players.includes(pValue)) {
        //Posicion de player en array
        let posPlayer = players.indexOf(pValue);
        players.splice(posPlayer, 1);

    }
    //Eliminamos card.
    let parent = player.parentNode.remove()
}

//Esta funcion eliminaria todos los players tanto en el array como en el boxText
function removeAll() {
    players = [];

    while (playerBoards[0].firstChild) {
        playerBoards[0].removeChild(playerBoards[0].firstChild);
    }
}
//Funcionalidad tips en mouseOver
//Se hace que aparezca el tip en mouseOver y desaparezca en mouseLeft
function tipUpload(behavior) {
    let p = document.getElementById("tip-Upload");
    if (!behavior) {
        p.classList.add("noVisibility");
    } else {

        p.classList.remove("noVisibility");
    }


}
//Se define para check el valor del slider de section 2 WIP
let optionType = "";


//Funcionalidad para definir las opciones disponibles en section 2.
//Los equipos pueden ser de un minimo de 2 participantes.
//Tener variable con que opciones quedarian desequilibrados los equipos.
function createOptions() {
    let playerL = players.length;



}


//Generar lista de options en base a numero de equipos
function generateByTeamNumber(len) {
    //Alamcenamos las opciones en un array auxiliar
    let auxArrOptions = [];
    for (let index = 2; index < len; index++) {
        //Verificamos que los equipos sean de minimo 2 participantes
        if (len / index < 2) {
            break;
        }
        auxArrOptions.push(generateOptionHTML(index));
    }
    return auxArrOptions;

}
//Generar lista de options en base a numero de players
function generateByPlayerNumber(len) {
    let auxArrOptions = [];
    //Los equipos pueden ser minimo de dos participantes, por lo que hacemos len.lenght/2 en el for-
    for (let index = 2; index <= len.length / 2; index++) {
        auxArrOptions.push(generateOptionHTML(index))
    }
    return auxArrOptions;
}

//Funcion para generar elemento HTML de options.
function generateOptionHTML(num) {
    let divElement = document.createElement("div");
    divElement.classList.add("options");
    divElement.innerHTML(num);
    return divElement;
}
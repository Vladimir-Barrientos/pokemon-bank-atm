/* =========================================================
   login.js
   Logica de la pantalla de inicio de sesion (PIN).
   Esta bien simple: solo compara el PIN escrito contra el
   PIN del usuario de prueba que esta en data.js
   ========================================================= */

/* =========================================================
   VARIABLES GLOBALES
   (siempre declaradas al inicio, antes de cualquier funcion)

   Nota: el <script> de este archivo esta al final del body,
   despues de todo el HTML, asi que cuando este codigo corre
   los elementos ya existen en la pagina y los podemos buscar
   de una vez con getElementById (no hace falta esperar a
   ningun evento "DOMContentLoaded").
   ========================================================= */
var formLogin = document.getElementById("formLogin");
var inputPin = document.getElementById("inputPin");
var mensajeError = document.getElementById("mensajeError");


/* =========================================================
   FUNCIONES
   ========================================================= */

// Cada vez que el usuario escribe algo en el campo de PIN,
// revisamos el texto y quitamos todo lo que no sea numero.
function limpiarCaracteresNoNumericos() {
  // La expresion regular /[^0-9]/g busca todo lo que NO sea
  // un digito (0-9) y lo reemplaza por nada (lo borra).
  inputPin.value = inputPin.value.replace(/[^0-9]/g, "");
}

// Se ejecuta cuando el usuario envia el formulario de login.
function manejarEnvioDeLogin(evento) {
  // Esto evita que la pagina se recargue sola (comportamiento
  // normal de un formulario HTML)
  evento.preventDefault();

  var pinEscrito = inputPin.value;

  // Validacion simple: tiene que tener exactamente 4 numeros.
  if (pinEscrito.length !== 4) {
    mensajeError.style.display = "block";
    return;
  } else {
    mensajeError.style.display = "none";
  }

  // Comparamos el PIN escrito contra el PIN del usuario de prueba
  if (pinEscrito === USUARIO_PRUEBA.pin) {
    // PIN correcto: guardamos la sesion y lo mandamos a la
    // pantalla de acciones.
    iniciarSesion();
    window.location.href = "acciones.html";
  } else {
    // PIN incorrecto: mostramos una alerta bonita con SweetAlert
    // en vez del "alert()" feo de JavaScript normal.
    swal("PIN incorrecto", "Por favor intenta de nuevo.", "error");

    // Limpiamos el campo para que lo vuelva a escribir
    inputPin.value = "";
    inputPin.focus();
  }
}


/* =========================================================
   CODIGO QUE SE EJECUTA AL CARGAR LA PAGINA
   ========================================================= */

// Nos aseguramos que exista el saldo/historial inicial
inicializarDatos();

// Si el usuario ya habia iniciado sesion antes (por ejemplo le
// dio "atras" al navegador), lo mandamos directo a acciones.
if (haySesionActiva()) {
  window.location.href = "acciones.html";
}

// Conectamos los eventos con sus funciones
inputPin.addEventListener("input", limpiarCaracteresNoNumericos);
formLogin.addEventListener("submit", manejarEnvioDeLogin);

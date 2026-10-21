/* =========================================================
   login.js
   Logica de la pantalla de inicio de sesion (PIN).
   Esta bien simple: solo compara el PIN escrito contra el
   PIN del usuario de prueba que esta en data.js
   ========================================================= */

// Cuando la pagina ya cargo completamente, ejecutamos este codigo.
// Esto evita errores por intentar usar un elemento del HTML que
// todavia no existe.
window.addEventListener("DOMContentLoaded", function () {

  // Primero nos aseguramos que exista el saldo/historial inicial
  inicializarDatos();

  // Si el usuario ya habia iniciado sesion antes (por ejemplo le
  // dio "atras" al navegador), lo mandamos directo a acciones.
  if (haySesionActiva()) {
    window.location.href = "acciones.html";
    return; // cortamos aqui para no seguir ejecutando el resto
  }

  // Agarramos los elementos del HTML que vamos a usar
  var formLogin = document.getElementById("formLogin");
  var inputPin = document.getElementById("inputPin");
  var mensajeError = document.getElementById("mensajeError");

  // --------- Restriccion: solo dejar escribir numeros ---------
  // Cada vez que el usuario escribe algo en el campo de PIN,
  // revisamos el texto y quitamos todo lo que no sea numero.
  inputPin.addEventListener("input", function () {
    // La expresion regular /[^0-9]/g busca todo lo que NO sea
    // un digito (0-9) y lo reemplaza por nada (lo borra).
    inputPin.value = inputPin.value.replace(/[^0-9]/g, "");
  });

  // --------- Cuando el usuario envia el formulario ---------
  formLogin.addEventListener("submit", function (evento) {
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
  });

});

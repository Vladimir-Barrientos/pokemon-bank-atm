/* =========================================================
   acciones.js
   Logica de la pantalla principal del cajero: depositar,
   retirar, consultar saldo, pagar servicios y salir.
   ========================================================= */

/* =========================================================
   VARIABLES GLOBALES
   (siempre declaradas al inicio, antes de cualquier funcion)

   El <script> esta al final del body, despues del HTML, asi
   que los elementos ya existen cuando buscamos con getElementById.
   ========================================================= */

// Textos de la tarjeta del usuario
var nombreUsuario = document.getElementById("nombreUsuario");
var numeroCuentaUsuario = document.getElementById("numeroCuentaUsuario");
var saldoActual = document.getElementById("saldoActual");

// Boton de consultar saldo
var btnConsultarSaldo = document.getElementById("btnConsultarSaldo");

// Elementos del modal de Deposito
var inputMontoDeposito = document.getElementById("montoDeposito");
var btnConfirmarDeposito = document.getElementById("btnConfirmarDeposito");

// Elementos del modal de Retiro
var inputMontoRetiro = document.getElementById("montoRetiro");
var btnConfirmarRetiro = document.getElementById("btnConfirmarRetiro");

// Elementos del modal de Pago de servicios
var selectTipoServicio = document.getElementById("tipoServicio");
var inputMontoPago = document.getElementById("montoPago");
var btnConfirmarPago = document.getElementById("btnConfirmarPago");

// Boton de salir
var btnSalir = document.getElementById("btnSalir");


/* =========================================================
   FUNCIONES
   ========================================================= */

// Lee el saldo guardado y lo escribe en pantalla con formato
// de dinero (ej. $5,000.00). La usamos varias veces, por eso
// la hicimos funcion aparte en vez de repetir el codigo.
function actualizarSaldoEnPantalla() {
  var saldo = obtenerSaldo();
  saldoActual.textContent = formatearMoneda(saldo);
}

// BOTON: Consultar saldo. Solo muestra el saldo, no cambia nada.
function manejarConsultarSaldo() {
  var saldo = obtenerSaldo();
  swal("Consulta de saldo", "Su saldo disponible es: " + formatearMoneda(saldo), "success");
}

// BOTON: Confirmar Deposito
function manejarConfirmarDeposito() {
  // Tomamos el valor escrito y lo pasamos a numero decimal
  var monto = parseFloat(inputMontoDeposito.value);

  // Validacion: tiene que ser un numero y mayor que cero
  if (isNaN(monto) || monto <= 0) {
    swal("Error", "Escriba un monto valido mayor a 0.", "error");
    return;
  }

  // Sumamos el monto al saldo actual
  var saldoNuevo = obtenerSaldo() + monto;
  guardarSaldo(saldoNuevo);

  // Guardamos la transaccion en el historial
  agregarTransaccion("Deposito", monto, "Deposito en efectivo");

  // Actualizamos lo que se ve en pantalla
  actualizarSaldoEnPantalla();

  // Cerramos el modal (usamos jQuery porque Bootstrap 4 lo usa)
  $("#modalDeposito").modal("hide");
  inputMontoDeposito.value = "";

  swal("Deposito exitoso", "Se deposito " + formatearMoneda(monto), "success");
}

// BOTON: Confirmar Retiro
function manejarConfirmarRetiro() {
  var monto = parseFloat(inputMontoRetiro.value);

  if (isNaN(monto) || monto <= 0) {
    swal("Error", "Escriba un monto valido mayor a 0.", "error");
    return;
  }

  var saldoDisponible = obtenerSaldo();

  // Validacion importante: no se puede retirar mas de lo que hay
  if (monto > saldoDisponible) {
    swal("Fondos insuficientes", "No tiene suficiente saldo para retirar esa cantidad.", "error");
    return;
  }

  var saldoNuevo = saldoDisponible - monto;
  guardarSaldo(saldoNuevo);

  agregarTransaccion("Retiro", monto, "Retiro en efectivo");

  actualizarSaldoEnPantalla();

  $("#modalRetiro").modal("hide");
  inputMontoRetiro.value = "";

  swal("Retiro exitoso", "Se retiro " + formatearMoneda(monto), "success");
}

// BOTON: Confirmar Pago de servicio
function manejarConfirmarPago() {
  var servicioElegido = selectTipoServicio.value;
  var monto = parseFloat(inputMontoPago.value);

  if (isNaN(monto) || monto <= 0) {
    swal("Error", "Escriba un monto valido mayor a 0.", "error");
    return;
  }

  var saldoDisponible = obtenerSaldo();

  if (monto > saldoDisponible) {
    swal("Fondos insuficientes", "No tiene suficiente saldo para pagar ese servicio.", "error");
    return;
  }

  var saldoNuevo = saldoDisponible - monto;
  guardarSaldo(saldoNuevo);

  // Aqui guardamos el tipo de servicio dentro de la descripcion
  // para que luego en el grafico se pueda agrupar bien.
  agregarTransaccion("Pago de servicio", monto, servicioElegido);

  actualizarSaldoEnPantalla();

  $("#modalPago").modal("hide");
  inputMontoPago.value = "";

  swal("Pago exitoso", "Se pago " + formatearMoneda(monto) + " de " + servicioElegido, "success");
}

// BOTON: Salir (cerrar sesion)
function manejarSalir() {
  // Le preguntamos primero si esta seguro, usando SweetAlert
  swal({
    title: "Cerrar sesion",
    text: "¿Seguro que desea salir?",
    icon: "warning",
    buttons: ["Cancelar", "Si, salir"]
  }).then(function (confirmado) {
    if (confirmado) {
      cerrarSesion();
      window.location.href = "index.html";
    }
  });
}


/* =========================================================
   CODIGO QUE SE EJECUTA AL CARGAR LA PAGINA
   ========================================================= */

// Si el usuario no ha iniciado sesion, lo sacamos de esta
// pagina (no puede entrar directo sin PIN).
protegerPagina();

// Nos aseguramos que los datos existan
inicializarDatos();

// Ponemos el nombre y numero de cuenta en pantalla
nombreUsuario.textContent = USUARIO_PRUEBA.nombre;
numeroCuentaUsuario.textContent = "Cuenta: " + USUARIO_PRUEBA.numeroCuenta;

// Mostramos el saldo actual
actualizarSaldoEnPantalla();

// Conectamos cada boton con su funcion
btnConsultarSaldo.addEventListener("click", manejarConsultarSaldo);
btnConfirmarDeposito.addEventListener("click", manejarConfirmarDeposito);
btnConfirmarRetiro.addEventListener("click", manejarConfirmarRetiro);
btnConfirmarPago.addEventListener("click", manejarConfirmarPago);
btnSalir.addEventListener("click", manejarSalir);

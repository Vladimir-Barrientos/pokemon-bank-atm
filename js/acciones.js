// acciones.js
// Logica de la pantalla principal del cajero: depositar,
// retirar, consultar saldo, pagar servicios y salir

// El <script> esta al final del body, despues del HTML, asi
// que los elementos ya existen cuando busco con getElementById

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


// Funciones

// Reglas de ValidateJS para validar que un monto sea un numero
// mayor que cero. La reuso en deposito, retiro y pago.
var reglasMonto = {
  monto: {
    presence: { allowEmpty: false, message: "no puede estar vacío" },
    numericality: { greaterThan: 0, message: "debe ser mayor a 0" }
  }
};

// Revisa un monto con ValidateJS. Si esta mal, muestra el error
// con SweetAlert y regresa false. Si esta bien, regresa true.
function montoEsValido(monto) {
  var errores = validate({ monto: monto }, reglasMonto);

  if (errores) {
    swal("Error", "Monto inválido: " + errores.monto[0], "error");
    return false;
  }

  return true;
}

// Despues de una transaccion exitosa, pregunto con SweetAlert si
// quiere descargar el comprobante en PDF de esa transaccion
function ofrecerComprobante(titulo, mensaje, transaccion) {
  swal({
    title: titulo,
    text: mensaje,
    icon: "success",
    buttons: ["Cerrar", "Descargar comprobante"]
  }).then(function (quiereComprobante) {
    if (quiereComprobante) {
      generarComprobantePDF(transaccion);
    }
  });
}

// Lee el saldo guardado y lo escribe en pantalla con formato
// de dinero (ej. $5,000.00). La uso varias veces, por eso
// la hice funcion aparte en vez de repetir el codigo
function actualizarSaldoEnPantalla() {
  var saldo = obtenerSaldo();
  saldoActual.textContent = formatearMoneda(saldo);
}

// BOTON: Consultar saldo. Solo muestra el saldo, no cambia nada
function manejarConsultarSaldo() {
  var saldo = obtenerSaldo();
  swal("Consulta de saldo", "Su saldo disponible es: " + formatearMoneda(saldo), "success");
}

// BOTON: Confirmar Deposito
function manejarConfirmarDeposito() {
  // Tomo el valor escrito y lo paso a numero decimal
  var monto = parseFloat(inputMontoDeposito.value);

  // Valido el monto con ValidateJS (numero y mayor que cero)
  if (!montoEsValido(monto)) {
    return;
  }

  // Sumo el monto al saldo actual
  var saldoNuevo = obtenerSaldo() + monto;
  guardarSaldo(saldoNuevo);

  // Guardo la transaccion en el historial
  var transaccion = agregarTransaccion("Depósito", monto, "Depósito en efectivo");

  // Actualizo lo que se ve en pantalla
  actualizarSaldoEnPantalla();

  // Cierro el modal (uso jQuery porque Bootstrap 4 lo usa)
  $("#modalDeposito").modal("hide");
  inputMontoDeposito.value = "";

  ofrecerComprobante("Depósito exitoso", "Se depositó " + formatearMoneda(monto), transaccion);
}

// BOTON: Confirmar Retiro
function manejarConfirmarRetiro() {
  var monto = parseFloat(inputMontoRetiro.value);

  if (!montoEsValido(monto)) {
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

  var transaccion = agregarTransaccion("Retiro", monto, "Retiro en efectivo");

  actualizarSaldoEnPantalla();

  $("#modalRetiro").modal("hide");
  inputMontoRetiro.value = "";

  ofrecerComprobante("Retiro exitoso", "Se retiró " + formatearMoneda(monto), transaccion);
}

// BOTON: Confirmar Pago de servicio
function manejarConfirmarPago() {
  var servicioElegido = selectTipoServicio.value;
  var monto = parseFloat(inputMontoPago.value);

  if (!montoEsValido(monto)) {
    return;
  }

  var saldoDisponible = obtenerSaldo();

  if (monto > saldoDisponible) {
    swal("Fondos insuficientes", "No tiene suficiente saldo para pagar ese servicio.", "error");
    return;
  }

  var saldoNuevo = saldoDisponible - monto;
  guardarSaldo(saldoNuevo);

  // Aqui guardo el tipo de servicio dentro de la descripcion
  // para que luego en el grafico se pueda agrupar bien
  var transaccion = agregarTransaccion("Pago de servicio", monto, servicioElegido);

  actualizarSaldoEnPantalla();

  $("#modalPago").modal("hide");
  inputMontoPago.value = "";

  ofrecerComprobante("Pago exitoso", "Se pagó " + formatearMoneda(monto) + " de " + servicioElegido, transaccion);
}

// BOTON: Salir (cerrar sesion)
function manejarSalir() {
  // Le pregunto primero si esta seguro, usando SweetAlert
  swal({
    title: "Cerrar sesión",
    text: "¿Seguro que desea salir?",
    icon: "warning",
    buttons: ["Cancelar", "Sí, salir"]
  }).then(function (confirmado) {
    if (confirmado) {
      cerrarSesion();
      window.location.href = "index.html";
    }
  });
}


// Si el usuario no ha iniciado sesion, lo saco de esta
// pagina (no puede entrar directo sin PIN)
protegerPagina();

// Me aseguro que los datos existan
inicializarDatos();

// Pongo el nombre y numero de cuenta en pantalla
nombreUsuario.textContent = USUARIO_PRUEBA.nombre;
numeroCuentaUsuario.textContent = "Cuenta: " + USUARIO_PRUEBA.numeroCuenta;

// Muestro el saldo actual
actualizarSaldoEnPantalla();

// Conecto cada boton con su funcion
btnConsultarSaldo.addEventListener("click", manejarConsultarSaldo);
btnConfirmarDeposito.addEventListener("click", manejarConfirmarDeposito);
btnConfirmarRetiro.addEventListener("click", manejarConfirmarRetiro);
btnConfirmarPago.addEventListener("click", manejarConfirmarPago);
btnSalir.addEventListener("click", manejarSalir);

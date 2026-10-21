/* =========================================================
   acciones.js
   Logica de la pantalla principal del cajero: depositar,
   retirar, consultar saldo, pagar servicios y salir.
   ========================================================= */

window.addEventListener("DOMContentLoaded", function () {

  // Paso 1: si el usuario no ha iniciado sesion, lo sacamos
  // de esta pagina (no puede entrar directo sin PIN).
  protegerPagina();

  // Paso 2: nos aseguramos que los datos existan
  inicializarDatos();

  // Paso 3: ponemos el nombre y numero de cuenta en pantalla
  document.getElementById("nombreUsuario").textContent = USUARIO_PRUEBA.nombre;
  document.getElementById("numeroCuentaUsuario").textContent = "Cuenta: " + USUARIO_PRUEBA.numeroCuenta;

  // Paso 4: mostramos el saldo actual (llamamos a una funcion
  // propia para no repetir codigo, la definimos mas abajo)
  actualizarSaldoEnPantalla();


  /* ---------------------------------------------------------
     Funcion que lee el saldo guardado y lo escribe en pantalla
     con formato de dinero (ej. $5,000.00)
     --------------------------------------------------------- */
  function actualizarSaldoEnPantalla() {
    var saldo = obtenerSaldo();
    document.getElementById("saldoActual").textContent = formatearMoneda(saldo);
  }


  /* ---------------------------------------------------------
     BOTON: Consultar saldo
     Solo muestra el saldo en una alerta, no cambia nada.
     --------------------------------------------------------- */
  document.getElementById("btnConsultarSaldo").addEventListener("click", function () {
    var saldo = obtenerSaldo();
    swal("Consulta de saldo", "Su saldo disponible es: " + formatearMoneda(saldo), "success");
  });


  /* ---------------------------------------------------------
     BOTON: Confirmar Deposito
     --------------------------------------------------------- */
  document.getElementById("btnConfirmarDeposito").addEventListener("click", function () {

    // Tomamos el valor escrito y lo pasamos a numero decimal
    var inputMonto = document.getElementById("montoDeposito");
    var monto = parseFloat(inputMonto.value);

    // Validacion: tiene que ser un numero y mayor que cero
    if (isNaN(monto) || monto <= 0) {
      swal("Error", "Escriba un monto valido mayor a 0.", "error");
      return;
    }

    // Sumamos el monto al saldo actual
    var saldoActual = obtenerSaldo();
    var saldoNuevo = saldoActual + monto;
    guardarSaldo(saldoNuevo);

    // Guardamos la transaccion en el historial
    agregarTransaccion("Deposito", monto, "Deposito en efectivo");

    // Actualizamos lo que se ve en pantalla
    actualizarSaldoEnPantalla();

    // Cerramos el modal (usamos jQuery porque Bootstrap 4 lo usa)
    $("#modalDeposito").modal("hide");
    inputMonto.value = "";

    swal("Deposito exitoso", "Se deposito " + formatearMoneda(monto), "success");
  });


  /* ---------------------------------------------------------
     BOTON: Confirmar Retiro
     --------------------------------------------------------- */
  document.getElementById("btnConfirmarRetiro").addEventListener("click", function () {

    var inputMonto = document.getElementById("montoRetiro");
    var monto = parseFloat(inputMonto.value);

    if (isNaN(monto) || monto <= 0) {
      swal("Error", "Escriba un monto valido mayor a 0.", "error");
      return;
    }

    var saldoActual = obtenerSaldo();

    // Validacion importante: no se puede retirar mas de lo que hay
    if (monto > saldoActual) {
      swal("Fondos insuficientes", "No tiene suficiente saldo para retirar esa cantidad.", "error");
      return;
    }

    var saldoNuevo = saldoActual - monto;
    guardarSaldo(saldoNuevo);

    agregarTransaccion("Retiro", monto, "Retiro en efectivo");

    actualizarSaldoEnPantalla();

    $("#modalRetiro").modal("hide");
    inputMonto.value = "";

    swal("Retiro exitoso", "Se retiro " + formatearMoneda(monto), "success");
  });


  /* ---------------------------------------------------------
     BOTON: Confirmar Pago de servicio
     --------------------------------------------------------- */
  document.getElementById("btnConfirmarPago").addEventListener("click", function () {

    var selectServicio = document.getElementById("tipoServicio");
    var servicioElegido = selectServicio.value;

    var inputMonto = document.getElementById("montoPago");
    var monto = parseFloat(inputMonto.value);

    if (isNaN(monto) || monto <= 0) {
      swal("Error", "Escriba un monto valido mayor a 0.", "error");
      return;
    }

    var saldoActual = obtenerSaldo();

    if (monto > saldoActual) {
      swal("Fondos insuficientes", "No tiene suficiente saldo para pagar ese servicio.", "error");
      return;
    }

    var saldoNuevo = saldoActual - monto;
    guardarSaldo(saldoNuevo);

    // Aqui guardamos el tipo de servicio dentro del "tipo" para
    // que luego en el grafico se pueda agrupar bien.
    agregarTransaccion("Pago de servicio", monto, servicioElegido);

    actualizarSaldoEnPantalla();

    $("#modalPago").modal("hide");
    inputMonto.value = "";

    swal("Pago exitoso", "Se pago " + formatearMoneda(monto) + " de " + servicioElegido, "success");
  });


  /* ---------------------------------------------------------
     BOTON: Salir (cerrar sesion)
     --------------------------------------------------------- */
  document.getElementById("btnSalir").addEventListener("click", function () {
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
  });

});

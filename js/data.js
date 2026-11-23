// data.js
// Aqui guardo los "datos de prueba" del usuario y unas
// funciones sencillas para manejar el saldo y el historial
// usando localStorage (que es como una mini base de datos
// que guarda el navegador)
//
// esto es una simulacion No hay servidor ni base de
// datos real, todo se guarda en el navegador del usuario

// Este es el unico usuario que puede entrar al cajero
// Son datos inventados, para simular un usuario real del banco
var USUARIO_PRUEBA = {
  nombre: "Ash Ketchum",
  numeroCuenta: "4521-7788-0099",
  pin: "1234",
  saldoInicial: 5000.00
};

// Funciones

// Funcion para inicializar los datos
// Esta funcion revisa si ya existe informacion guardada en
// localStorage. Si es la PRIMERA vez que se usa la pagina,
// crea el saldo inicial y un historial vacio
function inicializarDatos() {
  // getItem regresa "null" si la llave no existe todavia
  var saldoGuardado = localStorage.getItem("saldo");

  if (saldoGuardado === null) {
    // No existe nada guardado, entonces creo los datos
    // por primera vez con el saldo inicial del usuario de prueba
    localStorage.setItem("saldo", USUARIO_PRUEBA.saldoInicial);
    // JSON.stringify convierte el arreglo en texto para poder
    // guardarlo (localStorage solo guarda texto)
    localStorage.setItem("historial", JSON.stringify([]));
  }
}

// Funciones para manejar el SALDO

// Regresa el saldo actual como numero (parseFloat convierte
// el texto guardado en localStorage a un numero decimal)
function obtenerSaldo() {
  var saldoTexto = localStorage.getItem("saldo");
  return parseFloat(saldoTexto);
}

// Guarda un nuevo valor de saldo
function guardarSaldo(nuevoSaldo) {
  localStorage.setItem("saldo", nuevoSaldo);
}

// Funciones para manejar el HISTORIAL

// Regresa el arreglo (array) de transacciones guardadas
function obtenerHistorial() {
  var historialTexto = localStorage.getItem("historial");
  // JSON.parse convierte el texto guardado otra vez en un
  // arreglo de objetos de JavaScript
  return JSON.parse(historialTexto);
}

// Agrega una transaccion nueva al historial
// tipo = "Deposito", "Retiro", "Pago de servicio", etc
// monto = cuanto dinero fue esa transaccion
function agregarTransaccion(tipo, monto, descripcion) {
  var historial = obtenerHistorial();

  // Creo un objeto con la info de la transaccion
  var nuevaTransaccion = {
    tipo: tipo,
    monto: monto,
    descripcion: descripcion,
    fecha: new Date().toLocaleString("es-ES") // fecha y hora actual
  };

  // La agrego al final del arreglo
  historial.push(nuevaTransaccion);

  // Guardo el arreglo actualizado otra vez en localStorage
  localStorage.setItem("historial", JSON.stringify(historial));

  // Regreso la transaccion creada por si quien llamo esta funcion
  // necesita generar un comprobante con sus datos
  return nuevaTransaccion;
}

// Genera y descarga un comprobante en PDF de UNA sola
// transaccion (la que se acaba de realizar). La uso en
// acciones.js justo despues de depositar, retirar o pagar.
// Necesita que la pagina tenga cargada la libreria jsPDF.
function generarComprobantePDF(transaccion) {
  var jsPDF = window.jspdf.jsPDF;
  var doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Pokémon Bank - Comprobante de transacción", 10, 15);

  doc.setFontSize(11);
  doc.text("Cliente: " + USUARIO_PRUEBA.nombre, 10, 28);
  doc.text("Cuenta: " + USUARIO_PRUEBA.numeroCuenta, 10, 35);
  doc.text("Fecha: " + transaccion.fecha, 10, 42);

  doc.line(10, 48, 200, 48);

  doc.text("Tipo de transacción: " + transaccion.tipo, 10, 58);
  doc.text("Descripción: " + transaccion.descripcion, 10, 65);
  doc.text("Monto: " + formatearMoneda(transaccion.monto), 10, 72);
  doc.text("Saldo disponible después de la transacción: " + formatearMoneda(obtenerSaldo()), 10, 79);

  // Nombre de archivo unico usando la fecha/hora, para que no se
  // sobreescriba el comprobante anterior si descarga varios
  doc.save("comprobante-" + Date.now() + ".pdf");
}

// Funcion para dar formato a dinero
// Convierte un numero como 1500.5 en texto "$1,500.50"
function formatearMoneda(numero) {
  return "$" + numero.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Funciones para la SESION (login)

// Marca que el usuario ya inicio sesion correctamente
// Uso sessionStorage (no localStorage) porque la sesion
// debe borrarse si el usuario cierra la pestaña/navegador
function iniciarSesion() {
  sessionStorage.setItem("sesionActiva", "true");
}

// Revisa si hay una sesion activa. Regresa true o false
function haySesionActiva() {
  return sessionStorage.getItem("sesionActiva") === "true";
}

// Cierra la sesion (lo uso en el boton "Salir")
function cerrarSesion() {
  sessionStorage.removeItem("sesionActiva");
}

// Esta funcion la pongo al inicio de acciones.html,
// historial.html y grafico.html. Si el usuario no ha hecho
// login, lo regreso a la pantalla de login (index.html)
function protegerPagina() {
  if (!haySesionActiva()) {
    window.location.href = "index.html";
  }
}

/* =========================================================
   historial.js
   Pinta la tabla con todas las transacciones guardadas y
   arma un PDF descargable usando la libreria jsPDF.
   ========================================================= */

/* =========================================================
   VARIABLES GLOBALES
   (siempre declaradas al inicio, antes de cualquier funcion)
   ========================================================= */
var cuerpoTabla = document.getElementById("cuerpoTablaHistorial");
var mensajeSinDatos = document.getElementById("mensajeSinDatos");
var btnDescargarPdf = document.getElementById("btnDescargarPdf");


/* =========================================================
   FUNCIONES
   ========================================================= */

// Recorre el historial guardado y crea una fila de tabla por
// cada transaccion.
function pintarTablaHistorial() {
  var historial = obtenerHistorial();

  // Si no hay ninguna transaccion, mostramos el mensaje y no
  // seguimos con el resto de la funcion.
  if (historial.length === 0) {
    mensajeSinDatos.style.display = "block";
    return;
  }

  // Recorremos cada transaccion con un "for" normal (facil de
  // entender y explicar paso a paso)
  for (var i = 0; i < historial.length; i++) {
    var transaccion = historial[i];

    // Creamos una fila nueva de tabla (<tr>)
    var fila = document.createElement("tr");

    // Decidimos si el monto se ve en rojo (sale dinero) o en
    // verde (entra dinero), segun el tipo de transaccion.
    var claseColor = "texto-positivo";
    var signo = "+";
    if (transaccion.tipo === "Retiro" || transaccion.tipo === "Pago de servicio") {
      claseColor = "texto-negativo";
      signo = "-";
    }

    // Armamos el contenido de la fila con las 4 columnas
    fila.innerHTML =
      "<td>" + transaccion.fecha + "</td>" +
      "<td>" + transaccion.tipo + "</td>" +
      "<td>" + transaccion.descripcion + "</td>" +
      "<td class='" + claseColor + "'>" + signo + formatearMoneda(transaccion.monto) + "</td>";

    // Agregamos la fila al cuerpo de la tabla
    cuerpoTabla.appendChild(fila);
  }
}

// BOTON: Descargar PDF (ejemplo de uso de jsPDF)
function manejarDescargarPdf() {
  // jsPDF se carga dentro de "window.jspdf"
  var jsPDF = window.jspdf.jsPDF;
  var doc = new jsPDF();

  // Titulo del documento
  doc.setFontSize(16);
  doc.text("Pokemon Bank - Historial de transacciones", 10, 15);

  doc.setFontSize(11);
  doc.text("Cliente: " + USUARIO_PRUEBA.nombre, 10, 25);
  doc.text("Cuenta: " + USUARIO_PRUEBA.numeroCuenta, 10, 31);

  // Empezamos a escribir la lista de transacciones desde aqui
  var y = 42;
  var historialActual = obtenerHistorial();

  if (historialActual.length === 0) {
    doc.text("No hay transacciones registradas.", 10, y);
  } else {
    for (var i = 0; i < historialActual.length; i++) {
      var t = historialActual[i];
      var linea = t.fecha + " | " + t.tipo + " | " + t.descripcion + " | " + formatearMoneda(t.monto);

      doc.text(linea, 10, y);

      // Bajamos 7 unidades para la siguiente linea, y si ya nos
      // quedamos sin espacio en la hoja, agregamos una pagina nueva.
      y = y + 7;
      if (y > 280) {
        doc.addPage();
        y = 15;
      }
    }
  }

  // Esto descarga el archivo en la computadora del usuario
  doc.save("historial-pokemon-bank.pdf");
}


/* =========================================================
   CODIGO QUE SE EJECUTA AL CARGAR LA PAGINA
   ========================================================= */

// Protegemos la pagina (sin login no se puede ver el historial)
protegerPagina();
inicializarDatos();

pintarTablaHistorial();

btnDescargarPdf.addEventListener("click", manejarDescargarPdf);

/* =========================================================
   grafico.js
   Suma cuanto dinero se ha movido por cada tipo de
   transaccion y lo dibuja en un grafico de pastel usando
   la libreria Chart.js.
   ========================================================= */

/* =========================================================
   VARIABLES GLOBALES
   (siempre declaradas al inicio, antes de cualquier funcion)
   ========================================================= */
var canvasGrafico = document.getElementById("graficoTransacciones");
var mensajeSinDatosGrafico = document.getElementById("mensajeSinDatosGrafico");


/* =========================================================
   FUNCIONES
   ========================================================= */

// Recorre el historial y suma los montos agrupados por tipo
// de transaccion. Regresa un objeto, por ejemplo:
// { "Deposito": 500, "Retiro": 100, "Pago de servicio": 60 }
function calcularSumasPorTipo(historial) {
  var sumasPorTipo = {
    "Deposito": 0,
    "Retiro": 0,
    "Pago de servicio": 0
  };

  for (var i = 0; i < historial.length; i++) {
    var transaccion = historial[i];

    // Si por algun motivo el tipo no esta en la cajita, lo creamos
    if (sumasPorTipo[transaccion.tipo] === undefined) {
      sumasPorTipo[transaccion.tipo] = 0;
    }

    sumasPorTipo[transaccion.tipo] = sumasPorTipo[transaccion.tipo] + transaccion.monto;
  }

  return sumasPorTipo;
}

// Dibuja el grafico de pastel con Chart.js usando las sumas
// que ya calculamos con calcularSumasPorTipo().
function dibujarGrafico(sumasPorTipo) {
  var etiquetas = Object.keys(sumasPorTipo);
  var valores = [];

  for (var j = 0; j < etiquetas.length; j++) {
    valores.push(sumasPorTipo[etiquetas[j]]);
  }

  var contexto = canvasGrafico.getContext("2d");

  new Chart(contexto, {
    type: "pie", // tipo de grafico: pastel
    data: {
      labels: etiquetas,
      datasets: [{
        label: "Monto por tipo de transaccion",
        data: valores,
        backgroundColor: [
          "#27ae60", // verde para deposito
          "#c0392b", // rojo para retiro
          "#2A75BB"  // azul para pago de servicios
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });
}


/* =========================================================
   CODIGO QUE SE EJECUTA AL CARGAR LA PAGINA
   ========================================================= */

protegerPagina();
inicializarDatos();

var historial = obtenerHistorial();

// Si no hay transacciones, no tiene sentido dibujar el grafico
if (historial.length === 0) {
  mensajeSinDatosGrafico.style.display = "block";
  canvasGrafico.style.display = "none";
} else {
  var sumasPorTipo = calcularSumasPorTipo(historial);
  dibujarGrafico(sumasPorTipo);
}

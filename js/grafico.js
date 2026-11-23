// grafico.js
// Suma cuanto dinero se ha movido por cada tipo de
// transaccion y lo dibuja en un grafico de pastel usando
// la librería Chart.js

var canvasGrafico = document.getElementById("graficoTransacciones");
var mensajeSinDatosGrafico = document.getElementById("mensajeSinDatosGrafico");


// Funciones

// Recorre el historial y cuenta CUANTAS transacciones hay de
// cada tipo (no cuanto dinero, solo la cantidad). Regresa un
// objeto, por ejemplo: { "Depósito": 3, "Retiro": 1, "Pago de servicio": 2 }
function calcularConteosPorTipo(historial) {
  var conteosPorTipo = {
    "Depósito": 0,
    "Retiro": 0,
    "Pago de servicio": 0
  };

  for (var i = 0; i < historial.length; i++) {
    var transaccion = historial[i];

    // Si por algun motivo el tipo no esta en la cajita, lo creo
    if (conteosPorTipo[transaccion.tipo] === undefined) {
      conteosPorTipo[transaccion.tipo] = 0;
    }

    conteosPorTipo[transaccion.tipo] = conteosPorTipo[transaccion.tipo] + 1;
  }

  return conteosPorTipo;
}

// Dibuja el grafico de pastel con Chart.js usando los conteos
// que ya calcule con calcularConteosPorTipo()
function dibujarGrafico(conteosPorTipo) {
  var etiquetas = Object.keys(conteosPorTipo);
  var valores = [];

  for (var j = 0; j < etiquetas.length; j++) {
    valores.push(conteosPorTipo[etiquetas[j]]);
  }

  var contexto = canvasGrafico.getContext("2d");

  new Chart(contexto, {
    type: "pie", // tipo de grafico: pastel
    data: {
      labels: etiquetas,
      datasets: [{
        label: "Número de transacciones por tipo",
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
        },
        tooltip: {
          callbacks: {
            // Para que en el tooltip se vea "3 transacciones" en
            // vez de solo el numero suelto
            label: function (contexto) {
              return contexto.label + ": " + contexto.parsed + " transacciones";
            }
          }
        }
      }
    }
  });
}

protegerPagina();
inicializarDatos();

var historial = obtenerHistorial();

// Si no hay transacciones, no tiene sentido dibujar el grafico
if (historial.length === 0) {
  mensajeSinDatosGrafico.style.display = "block";
  canvasGrafico.style.display = "none";
} else {
  var conteosPorTipo = calcularConteosPorTipo(historial);
  dibujarGrafico(conteosPorTipo);
}

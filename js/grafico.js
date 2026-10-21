/* =========================================================
   grafico.js
   Suma cuanto dinero se ha movido por cada tipo de
   transaccion y lo dibuja en un grafico de pastel usando
   la libreria Chart.js.
   ========================================================= */

window.addEventListener("DOMContentLoaded", function () {

  protegerPagina();
  inicializarDatos();

  var historial = obtenerHistorial();

  // Si no hay transacciones, no tiene sentido dibujar el grafico
  if (historial.length === 0) {
    document.getElementById("mensajeSinDatosGrafico").style.display = "block";
    document.getElementById("graficoTransacciones").style.display = "none";
    return; // cortamos aqui, no seguimos con el resto del codigo
  }

  /* ---------------------------------------------------------
     Paso 1: Sumar los montos agrupados por tipo de transaccion.
     Usamos un objeto normal como si fuera una "cajita" donde
     cada tipo tiene su propia suma acumulada.
     --------------------------------------------------------- */
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

  /* ---------------------------------------------------------
     Paso 2: Armar las listas que necesita Chart.js:
     - etiquetas: nombres de cada tipo (ej. "Deposito")
     - valores: la suma de dinero de cada tipo
     --------------------------------------------------------- */
  var etiquetas = Object.keys(sumasPorTipo);
  var valores = [];

  for (var j = 0; j < etiquetas.length; j++) {
    valores.push(sumasPorTipo[etiquetas[j]]);
  }

  /* ---------------------------------------------------------
     Paso 3: Dibujar el grafico con Chart.js
     --------------------------------------------------------- */
  var contexto = document.getElementById("graficoTransacciones").getContext("2d");

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

});

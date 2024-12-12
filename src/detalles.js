import { Butaca, Fila, Sector, Ticket } from './clases.js';

const festival = JSON.parse(localStorage.getItem('festival'));

let nocheId = '';
let cantidadButacasVendidas = 0;

const user = JSON.parse(sessionStorage.getItem('user')).id;

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  nocheId = params.get('noche');

  const noche = festival.noches.find((noche) => noche.id === nocheId);

  const detailsContainer = document.getElementById('details');

  let content = `
    <h2 class="mb-4 text-2xl font-bold text-gray-800">Detalles de la Noche</h2>
    <div class="mb-6">
      <p class="mb-2 text-lg text-gray-600"><span class="font-semibold">Fecha:</span> ${noche.fecha}</p>
      <p class="mb-2 text-lg text-gray-600"><span class="font-semibold">Hora de inicio:</span> ${noche.horaInicio}</p>
      <p class="mb-2 text-lg text-gray-600"><span class="font-semibold">Hora de fin:</span> ${noche.horaFin}</p>
      <p class="mb-2 text-lg text-gray-600 font-bold">La hora de finalización puede variar si las presentaciones se extienden más de
        lo previsto. </p>
    </div>
    <h3 class="mb-4 text-xl font-semibold text-gray-700">Presentaciones</h3>
    <div class="space-y-4">
  `;

  noche.presentaciones.forEach((presentacion) => {
    content += `
      <div class="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm">
        <p class="mb-2 text-lg font-medium text-gray-800">Grupo: <span class="text-blue-600">${presentacion.grupo.nombre}</span></p>
        <p class="mb-1 text-gray-600"><span class="font-semibold">Reconocimiento:</span> ${presentacion.grupo.reconocimiento}</p>
        <p class="mb-1 text-gray-600"><span class="font-semibold">Hora de presentación:</span> ${presentacion.horaInicio}-${presentacion.horaFin} hrs.</p>
      </div>
    `;
  });

  const checkTickets = JSON.parse(localStorage.getItem('ticket'));
  if (checkTickets) {
    const div = document.getElementById('tickets-vendidos');

    div.innerHTML = `<div class="text-blue-500 font-bold">Tickets Vendidos</div>`;
    const datax = {};
    checkTickets.forEach((ticket) => {
      if (ticket.noche === nocheId) {
        if (!datax[ticket.tipo]) {
          datax[ticket.tipo] = 0;
        }
        datax[ticket.tipo] += 1;
        cantidadButacasVendidas += 1;
      }
    });
    const keys = Object.keys(datax);
    for (let index = 0; index < keys.length; index++) {
      div.innerHTML += `<div>${keys[index]}: ${datax[keys[index]]} </div>`;
    }
  }
  content += '</div>';

  detailsContainer.innerHTML = content;
});

//* TICKET

document.addEventListener('DOMContentLoaded', () => {
  const datosSectores = [
    { id: 'A', distancia: 'Cerca', color: 'bg-red-500', filas: 5, butacasPorFila: 10, precioBase: 150 },
    { id: 'B', distancia: 'Media', color: 'bg-blue-500', filas: 4, butacasPorFila: 8, precioBase: 120 },
    { id: 'C', distancia: 'Lejos', color: 'bg-green-500', filas: 6, butacasPorFila: 12, precioBase: 100 },
  ];
  const div = document.getElementById('butacas-vacias');
  div.innerHTML = `
  <p class="font-bold">Butacas vacias: ${5 * 10 + 4 * 8 + 6 * 12 - cantidadButacasVendidas}</p>`;
  const sectores = datosSectores.map((datos) => {
    const sector = new Sector(datos.id, datos.color, datos.distancia, datos.precioBase);

    for (let i = 1; i <= datos.filas; i++) {
      const fila = new Fila(i);

      for (let j = 1; j <= datos.butacasPorFila; j++) {
        const butaca = new Butaca(j);
        fila.agregarButaca(butaca);
      }

      sector.agregarFila(fila);
    }

    return sector;
  });

  const tipoEntradaPrecios = {
    mayores: 1,
    menores: 0.8,
    jubilados: 0.7,
    discapacitados: 0.5,
  };

  const descuentoAnticipado = 0.9;

  const sectoresContainer = document.getElementById('sectores');
  const sectorSelect = document.getElementById('sector');
  const tipoEntradaSelect = document.getElementById('tipoEntrada');
  const precioDisplay = document.getElementById('precio');
  const filaSelect = document.getElementById('fila');
  const butacaSelect = document.getElementById('butaca');
  const mensaje = document.getElementById('mensaje');
  const ticketContainer = document.getElementById('ticket');

  const calcularPrecio = () => {
    const sector = sectores.find((s) => s.id === sectorSelect.value);
    const tipoEntrada = tipoEntradaPrecios[tipoEntradaSelect.value] || 0;
    if (!sector) return;
    if (sector.id && tipoEntrada) {
      let precioFinal = sector.precioBase * tipoEntrada;

      if (esVentaAnticipada()) {
        precioFinal *= descuentoAnticipado;
      }
      precioDisplay.innerText = `Precio: $${precioFinal.toFixed(2)}`;
      return precioFinal;
    } else {
      precioDisplay.innerText = 'Precio: $0';
      return 0;
    }
  };

  const esVentaAnticipada = () => {
    const fechaActual = new Date();
    const fechaFestival = new Date('2024-12-20');
    const diasDiferencia = (fechaFestival - fechaActual) / (1000 * 60 * 60 * 24);
    return diasDiferencia > 30;
  };

  tipoEntradaSelect.addEventListener('change', calcularPrecio);
  sectorSelect.addEventListener('change', calcularPrecio);

  const renderSectores = () => {
    sectores.forEach((sector) => {
      const sectorDiv = document.createElement('div');
      sectorDiv.className = `sector p-4 rounded-lg text-white font-bold text-center cursor-pointer ${sector.color}`;
      sectorDiv.innerHTML = `Sector ${sector.id}
      <p>Distancia: ${sector.distancia}</p>
      `;
      sectorDiv.dataset.id = sector.id;
      sectoresContainer.appendChild(sectorDiv);

      const sectorOption = document.createElement('option');
      sectorOption.value = sector.id;
      sectorOption.innerText = `Sector ${sector.id}`;
      sectorSelect.appendChild(sectorOption);
    });
  };

  const renderFilas = (sectorId) => {
    filaSelect.innerHTML = '<option value="" disabled selected>Seleccionar fila</option>';
    butacaSelect.innerHTML = '<option value="" disabled selected>Seleccionar butaca</option>';
    const sector = sectores.find((s) => s.id === sectorId);

    for (let i = 0; i < sector.filas.length; i++) {
      const filaOption = document.createElement('option');
      filaOption.value = i + 1;
      filaOption.innerText = `Fila ${i + 1}`;
      filaSelect.appendChild(filaOption);
    }
  };

  const renderButacas = (sectorId, filaId) => {
    butacaSelect.innerHTML = '<option value="" disabled selected>Seleccionar butaca</option>';
    const sector = sectores.find((s) => s.id === sectorId);
    for (let i = 0; i < sector.filas[0].butacas.length; i++) {
      const butacaOption = document.createElement('option');
      butacaOption.value = i + 1;
      butacaOption.innerText = `Butaca ${i + 1}`;
      butacaSelect.appendChild(butacaOption);
    }
  };

  renderSectores();

  sectorSelect.addEventListener('change', (e) => {
    renderFilas(e.target.value);
  });

  filaSelect.addEventListener('change', (e) => {
    renderButacas(sectorSelect.value, e.target.value);
  });

  const generarTicket = (sector, fila, butaca, precio, tipoEntrada) => {
    const ticketHTML = `
      <div class="p-4 mt-6 bg-white border border-gray-300 rounded-lg shadow-lg">
        <h3 class="text-lg font-bold">Ticket de Entrada</h3>
        <p><strong>Número de Factura:</strong> ${generarNumeroFactura()}</p>
        <p><strong>Sector:</strong> ${sector}</p>
        <p><strong>Fila:</strong> ${fila}</p>
        <p><strong>Butaca:</strong> ${butaca}</p>
        <p><strong>Tipo de Entrada:</strong> ${tipoEntrada}</p>
        <p><strong>Precio:</strong> $${precio.toFixed(2)}</p>
        <p><strong>Fecha de Venta:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Forma de Pago:</strong> Efectivo</p>
        <p class="text-sm text-gray-500">¡Gracias por tu compra! Recuerda que la venta es solo de contado efectivo.</p>
      </div>
    `;
    ticketContainer.innerHTML = ticketHTML;
  };

  document.getElementById('venta-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const sector = sectorSelect.value;
    const fila = filaSelect.value;
    const butaca = butacaSelect.value;
    const tipoEntrada = tipoEntradaSelect.value;
    const numeroFactura = generarNumeroFactura();
    const fechaVenta = new Date().toLocaleDateString();
    const precio = calcularPrecio();

    if (!sector || !fila || !butaca || !tipoEntrada) {
      mensaje.innerText = 'Por favor selecciona una butaca válida.';
      mensaje.className = 'mt-2 text-red-500';
      return;
    }
    const ticket = new Ticket(
      tipoEntrada,
      precio,
      sector,
      Number(fila),
      Number(butaca),
      numeroFactura,
      fechaVenta,
      nocheId,
      user,
    );
    const checkTickets = JSON.parse(localStorage.getItem('ticket'));

    let ocupado = false;

    if (!checkTickets) {
      localStorage.setItem('ticket', JSON.stringify([ticket]));
    } else {
      checkTickets.forEach((ticket) => {
        if (
          ticket.fila === Number(fila) &&
          ticket.butaca === Number(butaca) &&
          ticket.sector === sector &&
          ticket.noche === nocheId
        ) {
          ocupado = true;
        }
      });
      if (!ocupado) {
        localStorage.setItem('ticket', JSON.stringify(checkTickets.concat(ticket)));
      }
    }
    if (ocupado) return alert('Butaca ocupada, elija otra');

    generarTicket(sector, fila, butaca, precio, tipoEntrada);

    mensaje.innerText = `Entrada vendida: Sector ${sector}, Fila ${fila}, Butaca ${butaca}`;
    mensaje.className = 'text-green-500';

    location.reload();
  });
});

const generarNumeroFactura = () => {
  return Math.floor(Math.random() * 1000000);
};

const tickets = JSON.parse(localStorage.getItem('ticket')) || [];
const ticketContainer = document.getElementById('ticket-container');

const userTickets = tickets.filter((ticket) => ticket.userId === user);
document.addEventListener('DOMContentLoaded', () => {
  userTickets.forEach((ticket) => {
    if (ticket.noche === nocheId) {
      const ticketCard = document.createElement('div');
      ticketCard.className = 'p-4 bg-white border border-gray-300 rounded-lg shadow-lg';
      ticketCard.id = `ticket-${ticket.numeroFactura}`;

      ticketCard.innerHTML = `
    <h3 class="text-lg font-bold">Ticket de Entrada</h3>
    <p><strong>Número de Factura:</strong> ${ticket.numeroFactura}</p>
    <p><strong>Sector:</strong> ${ticket.sector}</p>
    <p><strong>Fila:</strong> ${ticket.fila}</p>
    <p><strong>Butaca:</strong> ${ticket.butaca}</p>
    <p><strong>Tipo de Entrada:</strong> ${ticket.tipo}</p>
    <p><strong>Precio:</strong> $${ticket.precio.toFixed(2)}</p>
    <p><strong>Fecha de Venta:</strong> ${new Date(ticket.fecha).toLocaleDateString()}</p>
    <p><strong>Forma de Pago:</strong> ${ticket.formaPago || 'Efectivo'}</p>
    <p class="text-sm text-gray-500">¡Gracias por tu compra! Recuerda que la venta es solo de contado efectivo.</p>
    <button class="mt-4 bg-red-500 text-white px-4 py-2 rounded" onclick="eliminarTicket(${ticket.numeroFactura})">
    Cancelar Ticket
    </button>
    `;

      ticketContainer.appendChild(ticketCard);
    }
  });
});
window.eliminarTicket = function (numeroFactura) {
  const ticket = tickets.find((ticket) => ticket.numeroFactura === numeroFactura);
  const updatedTickets = tickets.filter((ticket) => ticket.numeroFactura !== numeroFactura);
  localStorage.setItem('ticket', JSON.stringify(updatedTickets));

  alert(`Se te reintegro el 50% del monto abonado: $${ticket.precio / 2}`);
  const ticketElement = document.getElementById(`ticket-${numeroFactura}`);
  if (ticketElement) {
    ticketElement.remove();
  }
};

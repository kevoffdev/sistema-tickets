import { Festival, Grupo, Presentacion, Noche } from './clases.js';
import { festival as data } from './data.js';
import { ordenarPresentaciones } from './helpers.js';
function cargarFestival(data) {
  let festivalData = JSON.parse(localStorage.getItem('festival'));

  if (!festivalData) {
    const nuevoFestival = new Festival(data.nombre, data.fechaInicio, data.fechaFin);
    data.noches.forEach((noche) => {
      const nocheClass = new Noche(noche.fecha, noche.horaInicio, noche.horaFin, noche.id);
      nuevoFestival.agregarNoche(nocheClass);
    });
    ordenarPresentaciones(nuevoFestival.noches);

    localStorage.setItem('festival', JSON.stringify(nuevoFestival));

    return nuevoFestival;
  } else {
    const festival = new Festival(festivalData.nombre, festivalData.fechaInicio, festivalData.fechaFin);
    festivalData.noches.forEach((noche) => {
      const nocheClass = new Noche(noche.fecha, noche.horaInicio, noche.horaFin, noche.id);
      noche.presentaciones.forEach((p) => {
        const grupo = new Grupo(p.grupo.nombre, p.grupo.reconocimiento);
        const presentacion = new Presentacion(p.horaInicio, p.horaFin, grupo);
        nocheClass.agregarPresentacion(presentacion);
      });
      festival.agregarNoche(nocheClass);
    });
    ordenarPresentaciones(festival.noches);
    localStorage.setItem('festival', JSON.stringify(festival));
    return festival;
  }
}

const festival = cargarFestival(data);
console.log(festival);

function crearPresentacionDiv(presentacion, presentacionesContainer, noche) {
  const presentacionDiv = document.createElement('div');
  presentacionDiv.className = 'flex items-center justify-between p-4 bg-gray-100 rounded-md presentacion';
  presentacionDiv.dataset.horario = presentacion.horaPresentacion;
  presentacionDiv.innerHTML = `
    <div>
      <header>
        <h3 class="font-semibold">${presentacion.grupo.nombre} </h3>
        <span class="text-sm">${presentacion.grupo.reconocimiento}</span>
      </header>
      <p class="text-sm text-gray-600">Horario: ${presentacion.horaInicio}-${presentacion.horaFin}</p>
    </div>
    <div class="flex space-x-2">
      <button id=${presentacion.id} class="bg-yellow-500 text-white rounded px-4 py-1 hover:bg-yellow-600 actualizar">
        Actualizar
      </button>
      <button id=${presentacion.id} class="bg-red-500 text-white rounded px-4 py-1 hover:bg-red-600 eliminar">
        Eliminar
      </button>
    </div>
  `;

  presentacionDiv.querySelector('.eliminar').addEventListener('click', () => {
    console.log(`Eliminar presentación: ${presentacion.grupo.nombre}`);
    const id = presentacionDiv.querySelector('.eliminar').id;

    const nocheActual = festival.obtenerNochePorId(noche);
    nocheActual.eliminarPresentacion(id);
    localStorage.setItem('festival', JSON.stringify(festival));
    presentacionesContainer.removeChild(presentacionDiv);
  });

  presentacionDiv.querySelector('.actualizar').addEventListener('click', () => {
    const modal = document.getElementById('formulario-editar');
    modal.classList.remove('hidden');

    document.getElementById('grupo-editar').value = presentacion.grupo.nombre;
    document.getElementById('reconocimiento-editar').value = presentacion.grupo.reconocimiento;
    document.getElementById('horario-editar').value = presentacion.horaInicio + '-' + presentacion.horaFin;

    const formularioEditar = document.getElementById('form-editar-presentacion');
    // const id = presentacionDiv.querySelector('.eliminar').id;
    const id = presentacionDiv.querySelector('.actualizar').id;
    formularioEditar.onsubmit = (e) => {
      e.preventDefault();
      const horario = document.getElementById('horario-editar').value.split('-');
      const nocheActual = festival.obtenerNochePorId(noche);
      if (
        nocheActual.presentaciones.some(
          (p) => `${p.horaInicio}-${p.horaFin}` === `${horario[0]}-${horario[1]}` && p.id !== id,
        )
      ) {
        alert('El horario ya está ocupado. Por favor, elige otro.');
        return;
      }

      presentacion.grupo.nombre = document.getElementById('grupo-editar').value;
      presentacion.grupo.reconocimiento = document.getElementById('reconocimiento-editar').value;

      presentacion.horaInicio = horario[0];
      presentacion.horaFin = horario[1];

      presentacionDiv.querySelector('h3').textContent = presentacion.grupo.nombre;
      presentacionDiv.querySelector('span').textContent = presentacion.grupo.reconocimiento;
      presentacionDiv.querySelector('p').textContent = `Horario: ${presentacion.horaInicio}-${presentacion.horaFin}`;

      localStorage.setItem('festival', JSON.stringify(festival));

      modal.classList.add('hidden');
    };
  });

  document.getElementById('cerrar-editar').addEventListener('click', () => {
    const modal = document.getElementById('formulario-editar');
    modal.classList.add('hidden');
  });

  return presentacionDiv;
}

function configurarFormulario(noche, festival) {
  const form = document.getElementById(`form-${noche.id}`);
  const presentacionesContainer = document.getElementById(`presentaciones-${noche.id}`);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const grupoInput = document.getElementById(`grupo-${noche.id}`).value;
    const reconocimiento = document.getElementById(`reconocimiento-grupo-${noche.id}`).value;
    const horario = document.getElementById(`horario-${noche.id}`).value;

    let nombreDisponible = true;

    festival.noches.forEach((noche) => {
      noche.presentaciones.forEach((presentacion) => {
        if (presentacion.grupo.nombre === grupoInput) {
          nombreDisponible = false;
        }
      });
    });

    if (!nombreDisponible) {
      alert('Un grupo no puede presentarse 2 veces, grupo no disponible');
      nombreDisponible = true;
      return;
    }

    if (!grupoInput || !horario || !reconocimiento) {
      alert('Todos los campos son obligatorios');
      return;
    }

    const [horaInicio, horaFin] = horario.split('-');
    const nuevaPresentacion = new Presentacion(horaInicio, horaFin, new Grupo(grupoInput, reconocimiento));
    const nocheActual = festival.obtenerNochePorId(noche.id);

    if (nocheActual.presentaciones.some((p) => `${p.horaInicio}-${p.horaFin}` === horario)) {
      alert('El horario ya está ocupado. Por favor, elige otro.');
      return;
    }
    nocheActual.calcularDuracion(horaFin);
    nocheActual.agregarPresentacion(nuevaPresentacion);

    const presentacionDiv = crearPresentacionDiv(nuevaPresentacion, presentacionesContainer, noche.id);
    presentacionesContainer.appendChild(presentacionDiv);

    localStorage.setItem('festival', JSON.stringify(festival));
    form.reset();
  });
}

festival.noches.forEach((noche) => {
  const presentacionesContainer = document.getElementById(`presentaciones-${noche.id}`);
  ordenarPresentaciones(noche.presentaciones);
  localStorage.setItem('festival', JSON.stringify(festival));
  noche.presentaciones.forEach((presentacion) => {
    const presentacionDiv = crearPresentacionDiv(presentacion, presentacionesContainer, noche.id);
    presentacionesContainer.appendChild(presentacionDiv);
  });

  configurarFormulario(noche, festival);
});

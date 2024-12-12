import { festival as data } from './data.js';
import { ordenarPresentaciones } from './helpers.js';

let festival = JSON.parse(localStorage.getItem('festival'));
if (festival == null) {
  festival = data;
  ordenarPresentaciones(festival.noches);

  localStorage.setItem('festival', JSON.stringify(festival));
}

const gruposContainer = document.getElementById('grupos');

console.log(festival);

function actualizarGruposUI() {
  festival.noches.forEach((noche, index) => {
    if (noche.presentaciones.length >= 5) {
      const grupoDiv = document.createElement('div');
      grupoDiv.className = 'p-4 mb-4 bg-white rounded shadow noche';
      const nocheNumero = index + 1;
      grupoDiv.innerHTML = `
      <h3 class="text-lg font-bold">Noche ${nocheNumero}</h3>
      <p>Fecha: ${noche.fecha}</p>
      <p>Hora inicio: ${noche.horaInicio}</p>
      <p>Hora Fin: ${noche.horaFin}</p>
      <p>Grupos: ${noche.presentaciones.length}</p>
      <button
      class="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      data-noche-index="${noche.id}"
      >
      Ver Detalles
      </button>
      `;
      gruposContainer.appendChild(grupoDiv);
    } else {
      const grupoDiv = document.createElement('div');
      grupoDiv.className = 'p-4 mb-4 bg-red-500 rounded shadow opacity-70 noche';
      const nocheNumero = index + 1;
      grupoDiv.innerHTML = `
      <h3 class="text-lg font-bold">Noche ${nocheNumero}</h3>
      <p>Fecha: ${noche.fecha}</p>
      <p>Fecha no disponible por falta de grupos</p>
      `;
      gruposContainer.appendChild(grupoDiv);
    }
  });
}

gruposContainer.addEventListener('click', (event) => {
  if (event.target.getAttribute('data-noche-index')) {
    const id = event.target.getAttribute('data-noche-index');
    verDetalle(id);
  }
});

function actualizarUI(festival) {
  const headerTitle = document.getElementById('header-title');
  headerTitle.textContent = festival.nombre;

  const fecha = document.getElementById('fecha');
  fecha.innerText = `Fechas: Desde el ${festival.fechaInicio} hasta el ${festival.fechaFin}`;

  actualizarGruposUI();
}
actualizarUI(festival);

function verDetalle(noche) {
  console.log(noche);
  if (!sessionStorage.getItem('user')) {
    alert('Debe iniciar sesión para ver los detalles.');
    window.location.href = './login.html';
  } else {
    window.location.href = `./detalles.html?noche=${noche}`;
  }
}

const user = JSON.parse(sessionStorage.getItem('user'));

if (user == null) {
  const headerDivContainer = document.getElementById('header-div');
  const loginLink = document.createElement('a');
  loginLink.className = 'px-4 py-2 text-blue-600 bg-white rounded shadow';
  loginLink.href = './login.html';
  loginLink.innerText = 'Iniciar Sesión / Registrarse';
  headerDivContainer.appendChild(loginLink);
} else {
  const headerDivContainer = document.getElementById('header-div');
  const loginLink = document.createElement('div');
  loginLink.className = 'flex items-center gap-6 px-4 py-2 rounded';
  loginLink.innerHTML = `<p>Nombre: ${user.username.toUpperCase()}</p>
      <button id="logoutButton" class="rounded bg-red-500 px-4 py-2 transition hover:bg-red-600">
          Cerrar Sesión
        </button>
  `;
  headerDivContainer.appendChild(loginLink);

  document.getElementById('logoutButton').addEventListener('click', () => {
    sessionStorage.clear();
    alert('Sesión cerrada.');
    window.location.href = './index.html';
  });
}

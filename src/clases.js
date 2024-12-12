import { convertirHoraAMinutos } from './helpers.js';

export class Festival {
  constructor(nombre, fechaInicio, fechaFin) {
    this.nombre = nombre;
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
    this.noches = [];
  }

  agregarNoche(noche) {
    this.noches.push(noche);
  }

  obtenerNochePorId(id) {
    return this.noches.find((noche) => noche.id === id);
  }
}

export class Noche {
  constructor(fecha, horaInicio, horaFin, id) {
    this.fecha = fecha;
    this.horaInicio = horaInicio;
    this.horaFin = horaFin;
    this.presentaciones = [];
    this.id = id;
  }
  agregarPresentacion(presentacion) {
    this.presentaciones.push(presentacion);
  }
  eliminarPresentacion(id) {
    this.presentaciones = this.presentaciones.filter((p) => p.id !== id);
  }
  calcularDuracion(horaFin) {
    if (convertirHoraAMinutos(horaFin) > convertirHoraAMinutos(this.horaFin)) {
      this.horaFin = horaFin;
    }
  }
}

export class Presentacion {
  constructor(horaInicio, horaFin, grupo) {
    this.horaInicio = horaInicio;
    this.horaFin = horaFin;
    this.grupo = grupo;
    this.id = crypto.randomUUID();
  }
}

export class Grupo {
  constructor(nombre, reconocimiento) {
    this.nombre = nombre;
    this.reconocimiento = reconocimiento;
  }
}

//* Estadio

export class Sector {
  constructor(id, color, distancia, precioBase) {
    this.id = id;
    this.color = color;
    this.distancia = distancia;
    this.precioBase = precioBase;
    this.filas = [];
  }
  agregarFila(fila) {
    this.filas.push(fila);
  }
}

export class Fila {
  constructor(fila) {
    this.fila = fila;
    this.butacas = [];
  }
  agregarButaca(butaca) {
    this.butacas.push(butaca);
  }
}

export class Butaca {
  constructor(numero) {
    this.numero = numero;
    this.ocupada = false;
  }
}

export class Ticket {
  constructor(tipo, precio, sector, fila, butaca, numeroFactura, fechaVenta, noche, userId) {
    this.tipo = tipo;
    this.precio = precio;
    this.fila = fila;
    this.sector = sector;
    this.numeroFactura = numeroFactura;
    this.butaca = butaca;
    this.fechaVenta = fechaVenta;
    this.noche = noche;
    this.userId = userId;
  }
  calcularDescuento() {}
  anular() {}
}

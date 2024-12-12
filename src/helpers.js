export function convertirHoraAMinutos(hora) {
    const [horas, minutos] = hora.split(':').map(Number);
    return horas * 60 + minutos;
  }
  
  export function ordenarPresentaciones(presentaciones) {
    return presentaciones.sort((a, b) => {
      return convertirHoraAMinutos(a.horaInicio) - convertirHoraAMinutos(b.horaInicio);
    });
  }
  
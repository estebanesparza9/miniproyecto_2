export interface Reservacion {
    nombre: string;
    tipoHabitacion: 'Individual' | 'Doble' | 'Suite' | 'Familiar';
    serviciosSeleccionados: string[];
    metodoPago: 'Tarjeta' | 'Efectivo';
    fecha: string;
    hotel: string; 
    precioBase: number;
    precioServicios: number;
    precioTotal: number;
  }
  
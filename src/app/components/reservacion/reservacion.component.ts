import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HotelService } from '../../services/hotel.service';
import { Hotel } from '../../models/hotel';
import { Reservacion } from '../../models/reservacion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';

// Validador personalizado
function nombreCompletoValidator(control: FormControl) {
  const valor = control.value || '';
  const palabras = valor.trim().split(/\s+/);
  return palabras.length >= 2 ? null : { nombreCompleto: true };
}

@Component({
  selector: 'app-reservacion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  templateUrl: './reservacion.component.html',
  styleUrls: ['./reservacion.component.css']
})
export class ReservacionComponent implements OnInit {
  hotel!: Hotel;
  reservacionForm!: FormGroup;
  precioServicios = 0;
  precioTotal = 0;
  hoy: string = '';
  tiposHabitacion: string[] = ['Individual', 'Doble', 'Suite', 'Familiar'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: HotelService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.hotelService.obtenerHoteles().subscribe(hoteles => {
      const encontrado = hoteles.find(h => h.id === id);
      if (encontrado) {
        this.hotel = encontrado;
        this.inicializarFormulario();
      }
    });
  }

  inicializarFormulario() {
    const today = new Date();
    this.hoy = today.toISOString().split('T')[0];

    this.reservacionForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), nombreCompletoValidator]],
      tipoHabitacion: ['', Validators.required],
      serviciosSeleccionados: this.fb.group({}),
      metodoPago: ['', Validators.required],
      fecha: ['', Validators.required]
    });

    this.hotel.servicios.forEach(servicio => {
      const control = new FormControl(false);
      (this.reservacionForm.get('serviciosSeleccionados') as FormGroup).addControl(servicio, control);
    });

    this.calcularTotal();
  }

  calcularTotal() {
    if (!this.hotel || !this.hotel.precioServicio || !this.reservacionForm) {
      this.precioServicios = 0;
      this.precioTotal = 0;
      return;
    }

    const seleccionados = this.obtenerServiciosSeleccionados();
    this.precioServicios = seleccionados.length * this.hotel.precioServicio;
    this.precioTotal = this.hotel.precio + this.precioServicios;
  }

  obtenerServiciosSeleccionados(): string[] {
    const grupo = this.reservacionForm.get('serviciosSeleccionados')?.value;
    return Object.keys(grupo).filter(key => grupo[key]);
  }

  enviar() {
    if (this.reservacionForm.valid) {
      Swal.fire({
        title: '¿Confirmar reservación?',
        text: 'Verifica que los datos sean correctos antes de guardar.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, reservar',
        cancelButtonText: 'Cancelar'
      }).then(result => {
        if (result.isConfirmed) {
          const datos = this.reservacionForm.value;

          const nuevaReservacion: Reservacion = {
            nombre: datos.nombre,
            tipoHabitacion: datos.tipoHabitacion,
            serviciosSeleccionados: this.obtenerServiciosSeleccionados(),
            metodoPago: datos.metodoPago,
            fecha: datos.fecha,
            hotel: this.hotel.nombre,
            precioBase: this.hotel.precio,
            precioServicios: this.precioServicios,
            precioTotal: this.precioTotal
          };

          localStorage.setItem('reservacion', JSON.stringify(nuevaReservacion));

          Swal.fire('¡Reservación completada!', 'Gracias por tu preferencia.', 'success')
            .then(() => {
              this.reservacionForm.reset();
              this.precioServicios = 0;
              this.precioTotal = 0;
              this.router.navigate(['/hoteles']);
            });
        }
      });
    } else {
      Swal.fire('Error', 'Por favor completa todos los campos correctamente.', 'error');
    }
  }
}



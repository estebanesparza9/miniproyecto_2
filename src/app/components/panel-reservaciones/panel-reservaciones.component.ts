import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Reservacion } from '../../models/reservacion';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-panel-reservaciones',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './panel-reservaciones.component.html',
  styleUrls: ['./panel-reservaciones.component.css']
})
export class PanelReservacionesComponent implements OnInit {
  @Output() cerrar = new EventEmitter<void>();
  reservacion: Reservacion | null = null;

  ngOnInit(): void {
    const data = localStorage.getItem('reservacion');
    this.reservacion = data ? JSON.parse(data) : null;
  }

  eliminarReservacion() {
    Swal.fire({
      title: '¿Eliminar reservación?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        localStorage.removeItem('reservacion');
        this.reservacion = null;
        Swal.fire('Eliminado', 'La reservación fue eliminada.', 'success');
      }
    });
  }

  cerrarPanel() {
    this.cerrar.emit();
  }
}

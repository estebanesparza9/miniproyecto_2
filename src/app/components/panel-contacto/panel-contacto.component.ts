import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';
import { Contacto } from '../../models/contacto';

@Component({
  selector: 'app-panel-contacto',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './panel-contacto.component.html',
  styleUrls: ['./panel-contacto.component.css']
})
export class PanelContactoComponent implements OnInit {
  @Output() cerrar = new EventEmitter<void>();
  contacto: Contacto | null = null;

  ngOnInit(): void {
    const data = localStorage.getItem('contacto');
    this.contacto = data ? JSON.parse(data) : null;
  }

  eliminarContacto() {
    Swal.fire({
      title: '¿Eliminar solicitud de contacto?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        localStorage.removeItem('contacto');
        this.contacto = null;
        Swal.fire('Eliminado', 'La solicitud fue eliminada.', 'success');
      }
    });
  }

  cerrarPanel() {
    this.cerrar.emit();
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { PanelReservacionesComponent } from '../panel-reservaciones/panel-reservaciones.component';
import { PanelContactoComponent } from '../panel-contacto/panel-contacto.component';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    PanelReservacionesComponent,
    PanelContactoComponent
  ],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  vista: 'reservaciones' | 'contacto' | null = null;
  adminNombre: string = '';

  ngOnInit(): void {
    const adminGuardado = localStorage.getItem('adminLogueado');
    this.adminNombre = adminGuardado ? JSON.parse(adminGuardado).nombre : '';
  }

  mostrarReservaciones() {
    this.vista = 'reservaciones';
  }

  mostrarContacto() {
    this.vista = 'contacto';
  }

  cerrarVista() {
    this.vista = null;
  }
}

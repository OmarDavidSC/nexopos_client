import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adm-header',
  templateUrl: './adm-header.component.html',
  styleUrls: ['./adm-header.component.scss']
})
export class AdmHeaderComponent {

  @Input() titulo: string = '';
  @Input() descripcion: string = '';
  @Input() totalRegistros: number = 0;
  @Input() textoBoton: string = 'Nuevo';
  @Input() rutaRegreso: string = '/inicio';
  @Input() visible: boolean = false;

  @Output() accionNuevo = new EventEmitter<void>();

  constructor(
    private router: Router
  ) { }

  regresar() {
    this.router.navigate([this.rutaRegreso]);
  }

}

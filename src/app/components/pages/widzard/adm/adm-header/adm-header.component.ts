import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Breadcrumb } from 'src/app/shared/models/base/Breadcrumb';

@Component({
  selector: 'app-adm-header',
  templateUrl: './adm-header.component.html',
  styleUrls: ['./adm-header.component.scss']
})
export class AdmHeaderComponent {

  @Input() titulo: string = '';
  @Input() descripcion: string = '';
  @Input() breadcrumbs: Breadcrumb[] = [];
  @Input() rutaRegreso: string = '/inicio';

  @Output() accionNuevo = new EventEmitter<void>();

  @Input() textoBoton: string = 'Nuevo';
  @Input() visible: boolean = false;

  constructor(
    private router: Router
  ) { }


  navegar(ruta?: string) {
    if (ruta) {
      this.router.navigate([ruta]);
    }
  }

  regresar() {
    this.router.navigate([this.rutaRegreso]);
  }

}

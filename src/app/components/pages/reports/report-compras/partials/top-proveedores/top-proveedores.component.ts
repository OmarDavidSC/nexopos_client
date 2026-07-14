import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-proveedores',
  templateUrl: './top-proveedores.component.html',
  styleUrls: ['./top-proveedores.component.scss']
})
export class TopProveedoresComponent {

  @Input() Datos: any[] = [];

}

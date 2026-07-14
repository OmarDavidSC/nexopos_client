import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-resumen-compras',
  templateUrl: './resumen-compras.component.html',
  styleUrls: ['./resumen-compras.component.scss']
})
export class ResumenComprasComponent {

  @Input() Datos: any;

}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-clientes',
  templateUrl: './top-clientes.component.html',
  styleUrls: ['./top-clientes.component.scss']
})
export class TopClientesComponent {

   @Input() Datos: any[] = [];

}

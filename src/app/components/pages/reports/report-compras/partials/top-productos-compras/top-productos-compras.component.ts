import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-productos-compras',
  templateUrl: './top-productos-compras.component.html',
  styleUrls: ['./top-productos-compras.component.scss']
})
export class TopProductosComprasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() Datos:any[] = [];

}

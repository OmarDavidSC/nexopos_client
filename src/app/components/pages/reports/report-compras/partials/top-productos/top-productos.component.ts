import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-productos',
  templateUrl: './top-productos.component.html',
  styleUrls: ['./top-productos.component.scss']
})
export class TopProductosComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() Datos:any[] = [];

}

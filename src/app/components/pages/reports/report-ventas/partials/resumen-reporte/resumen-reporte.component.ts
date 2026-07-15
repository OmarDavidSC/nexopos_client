import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-resumen-reporte',
  templateUrl: './resumen-reporte.component.html',
  styleUrls: ['./resumen-reporte.component.scss']
})
export class ResumenReporteComponent {

  @Input() Resumen: any;

}

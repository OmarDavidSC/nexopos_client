import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-adm-paginator',
  templateUrl: './adm-paginator.component.html',
  styleUrls: ['./adm-paginator.component.scss']
})
export class AdmPaginatorComponent {

  @Input() PaginaActual: number = 1;
  @Input() TotalPaginas: number = 1;

  @Output() cambiarPaginaEvent = new EventEmitter();
  cambiarPagina(pagina: number) {
    if (pagina < 1 || pagina > this.TotalPaginas) {
      return;
    }
    this.cambiarPaginaEvent.emit(pagina);
  }

}

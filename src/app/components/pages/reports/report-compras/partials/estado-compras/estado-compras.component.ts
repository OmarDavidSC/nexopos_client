import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-estado-compras',
  templateUrl: './estado-compras.component.html',
  styleUrls: ['./estado-compras.component.scss'],
})
export class EstadoComprasComponent {
  @Input() Datos: any[] = [];

  getNombreEstado(status: string) {
    switch (status) {
      case 'COMPLETED':
        return 'Completada';

      case 'CANCELLED':
        return 'Cancelada';

      case 'PENDING':
        return 'Pendiente';

      default:
        return status;
    }
  }
}

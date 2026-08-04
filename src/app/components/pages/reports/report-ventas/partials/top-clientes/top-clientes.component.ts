import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-clientes',
  templateUrl: './top-clientes.component.html',
  styleUrls: ['./top-clientes.component.scss'],
})
export class TopClientesComponent {
  @Input() Datos: any[] = [];

  obtenerIniciales(nombre: string | null | undefined): string {
    if (!nombre) {
      return 'CL';
    }

    const palabras = nombre
      .trim()
      .split(/\s+/)
      .filter((item: string) => item.length > 0);

    if (palabras.length === 1) {
      return palabras[0].substring(0, 2).toUpperCase();
    }

    return (palabras[0].charAt(0) + palabras[1].charAt(0)).toUpperCase();
  }
}

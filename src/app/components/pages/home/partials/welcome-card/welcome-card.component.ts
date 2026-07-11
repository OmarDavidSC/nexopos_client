import { Component, Input, OnInit } from '@angular/core';
import { Eusuario } from 'src/app/shared/models/entidades/Eusuario';

@Component({
  selector: 'app-welcome-card',
  templateUrl: './welcome-card.component.html',
  styleUrls: ['./welcome-card.component.scss']
})
export class WelcomeCardComponent implements OnInit {

  @Input() usuario: Eusuario | null = null;
  @Input() resumen: any;

  FechaActual: Date = new Date();

  constructor() { }

  ngOnInit(): void {

  }


  get nombreUsuario(): string {

    if (!this.usuario) {
      return 'Usuario';
    }

    return `${this.usuario.NombreCompleto ?? ''}`;

  }


}

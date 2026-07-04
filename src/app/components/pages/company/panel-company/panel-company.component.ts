import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ECompany } from 'src/app/shared/models/entidades/ECompany';
import { ERol } from 'src/app/shared/models/entidades/ERol';
import { Eusuario } from 'src/app/shared/models/entidades/Eusuario';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CompanyService } from 'src/app/shared/services/company.service';
import { AuthStoreService } from 'src/app/shared/stores/auth-store.service';
import { ModalHtmlViewerComponent } from '../partials/modal-html-viewer/modal-html-viewer.component';
import { ComunModule } from "src/app/shared/comun.module";

@Component({
  selector: 'app-panel-company',
  templateUrl: './panel-company.component.html',
  styleUrls: ['./panel-company.component.scss'],
})
export class PanelCompanyComponent extends FormularioBase implements OnInit {

  UsuarioActual: Eusuario | null = null;
  Role: ERol | null = null;
  CompaniaActual: ECompany | null = null;

  Loading: boolean = false;
  Editando: boolean = false;
  BackupCompania: any = null;

  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
    public spinner: NgxSpinnerService,
    public authService: AuthService,
    public companyService: CompanyService,
    public auhtStore: AuthStoreService
  ) {
    super('panel-company', dialog, route, router, spinner)
  }

  ngOnInit(): void {
    Promise.all([
      this.auhtStore.getUser(),
      this.auhtStore.getRole(),
      this.auhtStore.getCompany()
    ]
    ).then(([resultadoUsuario, resultadoRole, resultadoCompany]) => {
      this.UsuarioActual = resultadoUsuario;
      this.Role = resultadoRole;
      this.CompaniaActual = resultadoCompany;
      this.initialize();
    });
  }

  async initialize() {
    this.Loading = true;
    this.Loading = false;
  }

  abrirTerminos() {
    this.dialog.open(ModalHtmlViewerComponent, {
      width: '800px',
      maxWidth: '95vw',
      data: {
        titulo: 'Términos y Condiciones',
        contenido: this.CompaniaActual.TCondiciones
      }
    });
  }

  abrirPoliticas() {
    this.dialog.open(ModalHtmlViewerComponent, {
      width: '800px',
      maxWidth: '95vw',
      data: {
        titulo: 'Políticas de Privacidad',
        contenido: this.CompaniaActual.PPolitica
      }
    });
  }

  activarEdicion() {
    this.BackupCompania = { ...this.CompaniaActual };
    this.Editando = true;
  }

  cancelarEdicion() {
    this.CompaniaActual = { ...this.BackupCompania };
    this.Editando = false;
  }
}

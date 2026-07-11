import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ECompany } from 'src/app/shared/models/entidades/ECompany';
import { ERol } from 'src/app/shared/models/entidades/ERol';
import { Eusuario } from 'src/app/shared/models/entidades/Eusuario';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PurchaseService } from 'src/app/shared/services/purchase.service';
import { AuthStoreService } from 'src/app/shared/stores/auth-store.service';
@Component({
  selector: 'app-ver-detalle-compra',
  templateUrl: './ver-detalle-compra.component.html',
  styleUrls: ['./ver-detalle-compra.component.scss']
})
export class VerDetalleCompraComponent extends FormularioBase implements OnInit {

  DetalleCompra: [] = [];
  Compra: any;
  UsuarioActual: Eusuario | null = null;
  CompaniaActual: ECompany | null = null;
  Role: ERol | null = null;
  IdCompra: number = 0;

  Loading: boolean = false;

  columnas = ['codigo', 'producto', 'cantidad', 'precio', 'subtotal'];

  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
    public spinner: NgxSpinnerService,
    public authService: AuthService,
    public compraService: PurchaseService,
    public auhtStore: AuthStoreService,
    public toastService: ToastrService,
  ) {
    super('detalle-compra', dialog, route, router, spinner)
  }

  ngOnInit(): void {
    Promise.all([
      this.auhtStore.getUser(),
      this.auhtStore.getRole(),
      this.auhtStore.getCompany(),
    ]
    ).then(([resultadoUsuario, resultadoRole, resultadoCompania]) => {
      this.UsuarioActual = resultadoUsuario;
      this.Role = resultadoRole;
      this.CompaniaActual = resultadoCompania;
      const tienePermiso = this.validarPermisos(
        this.Role,
        ['administrator'],
        this.router,
        this.toastService
      );

      if (tienePermiso) {
        this.initialize();
      }
    });
  }

  async initialize() {
    this.IdCompra = Number(this.route.snapshot.paramMap.get('id'));
    this.obtenerMaestros();
  }

  async obtenerMaestros() {
    this.Loading = true;
    const data = await this.compraService.show(this.IdCompra)
    this.DetalleCompra = data.data.details;
    this.Compra = data.data.purchase;
    this.Loading = false;
  }
}

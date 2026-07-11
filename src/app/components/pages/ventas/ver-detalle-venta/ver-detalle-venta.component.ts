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
import { SaleService } from 'src/app/shared/services/sale.service';
import { AuthStoreService } from 'src/app/shared/stores/auth-store.service';

@Component({
  selector: 'app-ver-detalle-venta',
  templateUrl: './ver-detalle-venta.component.html',
  styleUrls: ['./ver-detalle-venta.component.scss']
})
export class VerDetalleVentaComponent extends FormularioBase implements OnInit {

  DetalleVenta: [] = [];
  Venta: any;
  UsuarioActual: Eusuario | null = null;
  CompaniaActual: ECompany | null = null;
  Role: ERol | null = null;
  IdVenta: number = 0;

  Loading: boolean = false;

  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
    public spinner: NgxSpinnerService,
    public authService: AuthService,
    public ventaService: SaleService,
    public auhtStore: AuthStoreService,
    public toastService: ToastrService,
  ) {
    super('detalle-venta', dialog, route, router, spinner)
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
      this.CompaniaActual = resultadoCompania;
      const tienePermiso = this.validarPermisos(
        this.Role,
        ['administrator', 'seller'],
        this.router,
        this.toastService
      );

      if (tienePermiso) {
        this.initialize();
      }
    });
  }

  async initialize() {
    this.IdVenta = Number(this.route.snapshot.paramMap.get('id'));
    this.obtenerMaestros();
  }

  async obtenerMaestros() {
    this.Loading = true;
    const data = await this.ventaService.show(this.IdVenta)
    this.DetalleVenta = data.data.details;
    this.Venta = data.data.sale;
    this.Loading = false;
  }
}

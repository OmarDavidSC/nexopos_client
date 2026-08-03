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
import { QuotationService } from 'src/app/shared/services/quotation.service';
import { AuthStoreService } from 'src/app/shared/stores/auth-store.service';

@Component({
  selector: 'app-detalle-cotizacion',
  templateUrl: './detalle-cotizacion.component.html',
  styleUrls: ['./detalle-cotizacion.component.scss']
})
export class DetalleCotizacionComponent extends FormularioBase implements OnInit {

  Cotizacion: any = null;
  DetallesCotizacion: any[] = [];
  Venta: any = null;

  UsuarioActual: Eusuario | null = null;
  CompaniaActual: ECompany | null = null;
  Role: ERol | null = null;

  IdCotizacion: number = 0;
  Loading: boolean = false;

  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
    public spinner: NgxSpinnerService,
    public authService: AuthService,
    public cotizacionService: QuotationService,
    public auhtStore: AuthStoreService,
    public toastService: ToastrService,
  ) {
    super('detalle-cotizacion', dialog, route, router, spinner)
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
    this.IdCotizacion = Number(this.route.snapshot.paramMap.get('id'));
    this.obtenerMaestros();
  }

  async obtenerMaestros(): Promise<void> {
    this.Loading = true;
    try {
      const response = await this.cotizacionService.show(this.IdCotizacion);
      if (!response.success) {
        this.toastService.error(response.message || 'No se pudo obtener el detalle de la cotización.');
        this.router.navigate(['/bandeja-cotizaciones']);
        return;
      }
      this.Cotizacion = response.data?.quotation ?? null;
      this.DetallesCotizacion = response.data?.details ?? [];
      this.Venta = response.data?.quotation?.sale ?? null;
    } catch (error: any) {
      this.toastService.error(error?.error?.message || error?.message || 'Ocurrió un error al consultar la cotización.');
    } finally {
      this.Loading = false;
    }
  }
}

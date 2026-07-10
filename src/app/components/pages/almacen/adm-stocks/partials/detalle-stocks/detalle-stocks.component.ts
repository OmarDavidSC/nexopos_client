import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { EProductStock } from 'src/app/shared/models/entidades/EProductStock';
import { ERol } from 'src/app/shared/models/entidades/ERol';
import { Eusuario } from 'src/app/shared/models/entidades/Eusuario';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BranchService } from 'src/app/shared/services/branch.service';
import { ProductStockService } from 'src/app/shared/services/productstock.service';
import { AuthStoreService } from 'src/app/shared/stores/auth-store.service';
import { ModalActualizarStockComponent } from '../modal-actualizar-stock/modal-actualizar-stock.component';

@Component({
  selector: 'app-detalle-stocks',
  templateUrl: './detalle-stocks.component.html',
  styleUrls: ['./detalle-stocks.component.scss']
})
export class DetalleStocksComponent extends FormularioBase implements OnInit {

  ListaStocks: EProductStock[] = [];
  Resumen: any;
  UsuarioActual: Eusuario | null = null;
  Role: ERol | null = null;
  IdSucursal: number = 0;

  Loading: boolean = false;

  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
    public spinner: NgxSpinnerService,
    public authService: AuthService,
    public stocksService: ProductStockService,
    public auhtStore: AuthStoreService,
    public toastService: ToastrService,
  ) {
    super('detalle-stocks', dialog, route, router, spinner)
  }

  ngOnInit(): void {
    Promise.all([
      this.auhtStore.getUser(),
      this.auhtStore.getRole(),
    ]
    ).then(([resultadoUsuario, resultadoRole]) => {
      this.UsuarioActual = resultadoUsuario;
      this.Role = resultadoRole;
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
    this.IdSucursal = Number(this.route.snapshot.paramMap.get('id'));
    this.obtenerMaestros();
  }

  async obtenerMaestros() {
    this.Loading = true;
    const data = await this.stocksService.index(this.IdSucursal)
    this.ListaStocks = EProductStock.parseJsonList(data.data);
    this.Resumen = data.summary;
    this.Loading = false;
  }

  async eventoMostrarPopupEditarStock(item: EProductStock): Promise<void> {
    const dialogRef = this.dialog.open(ModalActualizarStockComponent, {
      width: '600px',
      disableClose: true,
      data: {
        stock: item,
        idSucursal: this.IdSucursal,
      }
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.initialize();
    }
  }

  OnEventoAbrirCrearProducto() {
      this.router.navigate(['/administracion-productos']);
    }
}

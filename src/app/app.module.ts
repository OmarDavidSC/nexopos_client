
import { ComunModule } from '../app/shared/comun.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AppComponent } from './app.component';
import { MenuLateralComponent } from './shared/components/menu-lateral/menu-lateral.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { ModalDialog } from "./shared/components/modal/modal.component";
import { GridLoaderComponent } from "./shared/components/grid-loader/grid-loader.component";
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { SigninComponent } from './components/authentication/signin/signin.component';
import { AddTokenInterceptor } from './shared/components/authentication/add-token.interceptor';
import { BandejaContratosComponent } from './components/pages/bandejas/bandeja-contratos/bandeja-contratos.component';
import { BandejaAdendasComponent } from './components/pages/bandejas/bandeja-adendas/bandeja-adendas.component';
import { ForgotPasswordComponent } from './components/authentication/forgot-password/forgot-password.component';
import { RestorePasswordComponent } from './components/authentication/restore-password/restore-password.component';
import { BandejaPerfilComponent } from './components/pages/profile/bandeja-perfil/bandeja-perfil.component';
import { ModalEditarPerfilComponent } from './components/pages/profile/partials/modal-editar-perfil/modal-editar-perfil.component';
import { ModalEditarPasswordComponent } from './components/pages/profile/partials/modal-editar-password/modal-editar-password.component';
import { ModalEditarEmailComponent } from './components/pages/profile/partials/modal-editar-email/modal-editar-email.component';
import { PanelCompanyComponent } from './components/pages/company/panel-company/panel-company.component';
import { AdmCategoriasComponent } from './components/pages/almacen/adm-categorias/adm-categorias.component';
import { AdmMarcasComponent } from './components/pages/almacen/adm-marcas/adm-marcas.component';
import { AdmUnidadesComponent } from './components/pages/almacen/adm-unidades/adm-unidades.component';
import { AdmProductosComponent } from './components/pages/almacen/adm-productos/adm-productos.component';
import { ModalCategoriaComponent } from './components/pages/almacen/modals/modal-categoria/modal-categoria.component';
import { ModalProductoComponent } from './components/pages/almacen/modals/modal-producto/modal-producto.component';
import { ModalMarcaComponent } from './components/pages/almacen/modals/modal-marca/modal-marca.component';
import { ModalUnidadComponent } from './components/pages/almacen/modals/modal-unidad/modal-unidad.component';
import { AdmHeaderComponent } from './components/pages/widzard/adm/adm-header/adm-header.component';
import { AdmPaginatorComponent } from './components/pages/widzard/adm/adm-paginator/adm-paginator.component';
import { ProductSummaryComponent } from './components/pages/almacen/adm-productos/partials/product-summary/product-summary.component';
import { ProductFiltersComponent } from './components/pages/almacen/adm-productos/partials/product-filters/product-filters.component';
import { ProductTableComponent } from './components/pages/almacen/adm-productos/partials/product-table/product-table.component';
import { ProovedorComponent } from './components/pages/compras/proovedor/proovedor.component';
import { ModalProveedorComponent } from './components/pages/compras/modals/modal-proveedor/modal-proveedor.component';
import { BandejaComprasComponent } from './components/pages/compras/bandeja-compras/bandeja-compras.component';
import { PurchaseSummaryComponent } from './components/pages/compras/bandeja-compras/partials/purchase-summary/purchase-summary.component';
import { PurchaseFiltersComponent } from './components/pages/compras/bandeja-compras/partials/purchase-filters/purchase-filters.component';
import { PurchaseTimelineComponent } from './components/pages/compras/bandeja-compras/partials/purchase-timeline/purchase-timeline.component';
import { PurchaseCardComponent } from './components/pages/compras/bandeja-compras/partials/purchase-card/purchase-card.component';
import { FormularioNuevaCompraComponent } from './components/pages/compras/formulario-nueva-compra/formulario-nueva-compra.component';
import { VerDetalleCompraComponent } from './components/pages/compras/ver-detalle-compra/ver-detalle-compra.component';
import { ModalCancelarCompraComponent } from './components/pages/compras/modals/modal-cancelar-compra/modal-cancelar-compra.component';
import { StepVerticalComponent } from './components/pages/widzard/step-vertical/step-vertical.component';
import { BandejaVentasComponent } from './components/pages/ventas/bandeja-ventas/bandeja-ventas.component';
import { FormularioNuevaVentaComponent } from './components/pages/ventas/formulario-nueva-venta/formulario-nueva-venta.component';
import { VerDetalleVentaComponent } from './components/pages/ventas/ver-detalle-venta/ver-detalle-venta.component';
import { ClientesComponent } from './components/pages/ventas/clientes/clientes.component';
import { ModalClienteComponent } from './components/pages/ventas/modals/modal-cliente/modal-cliente.component';
import { ModalAnularVentaComponent } from './components/pages/ventas/modals/modal-anular-venta/modal-anular-venta.component';
import { SaleCardComponent } from './components/pages/ventas/bandeja-ventas/partials/sale-card/sale-card.component';
import { SaleFiltersComponent } from './components/pages/ventas/bandeja-ventas/partials/sale-filters/sale-filters.component';
import { SaleSummaryComponent } from './components/pages/ventas/bandeja-ventas/partials/sale-summary/sale-summary.component';
import { SaleTimelineComponent } from './components/pages/ventas/bandeja-ventas/partials/sale-timeline/sale-timeline.component';
import { AdmUsuarioComponent } from './components/pages/usuario/adm-usuario/adm-usuario.component';
import { ModalUsuarioComponent } from './components/pages/usuario/modals/modal-usuario/modal-usuario.component';
import { AdmSucursalComponent } from './components/pages/sucursal/adm-sucursal/adm-sucursal.component';
import { ModalSucursalComponent } from './components/pages/sucursal/modals/modal-sucursal/modal-sucursal.component';
import { AdmStocksComponent } from './components/pages/almacen/adm-stocks/adm-stocks.component';
import { DetalleStocksComponent } from './components/pages/almacen/adm-stocks/partials/detalle-stocks/detalle-stocks.component';
import { ModalActualizarStockComponent } from './components/pages/almacen/adm-stocks/partials/modal-actualizar-stock/modal-actualizar-stock.component';
import { DashboardComponent } from './components/pages/home/dashboard/dashboard.component';
import { WelcomeCardComponent } from './components/pages/home/partials/welcome-card/welcome-card.component';
import { SummaryCardsComponent } from './components/pages/home/partials/summary-cards/summary-cards.component';
import { InventorySummaryComponent } from './components/pages/home/partials/inventory-summary/inventory-summary.component';
import { AlertsStockComponent } from './components/pages/home/partials/alerts-stock/alerts-stock.component';
import { SalesChartComponent } from './components/pages/home/partials/sales-chart/sales-chart.component';
import { TopProductsComponent } from './components/pages/home/partials/top-products/top-products.component';
import { TopCategoriesComponent } from './components/pages/home/partials/top-categories/top-categories.component';
import { BranchPerformanceComponent } from './components/pages/home/partials/branch-performance/branch-performance.component';
import { SalesTodayComponent } from './components/pages/home/partials/sales-today/sales-today.component';
import { PurchaseTodayComponent } from './components/pages/home/partials/purchase-today/purchase-today.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { IndexVentasComponent } from './components/pages/reports/report-ventas/index-ventas/index-ventas.component';
import { IndexComprasComponent } from './components/pages/reports/report-compras/index-compras/index-compras.component';
import { IndexInventarioComponent } from './components/pages/reports/report-inventario/index-inventario/index-inventario.component';
import { FiltrosReporteComponent } from './components/pages/reports/report-ventas/partials/filtros-reporte/filtros-reporte.component';
import { ResumenReporteComponent } from './components/pages/reports/report-ventas/partials/resumen-reporte/resumen-reporte.component';
import { GraficoVentasDiaComponent } from './components/pages/reports/report-ventas/partials/grafico-ventas-dia/grafico-ventas-dia.component';
import { GraficoVentasMesComponent } from './components/pages/reports/report-ventas/partials/grafico-ventas-mes/grafico-ventas-mes.component';
import { TopProductosComponent } from './components/pages/reports/report-ventas/partials/top-productos/top-productos.component';
import { TopClientesComponent } from './components/pages/reports/report-ventas/partials/top-clientes/top-clientes.component';
import { MetodosPagoComponent } from './components/pages/reports/report-ventas/partials/metodos-pago/metodos-pago.component';
import { TiposVoucherComponent } from './components/pages/reports/report-ventas/partials/tipos-voucher/tipos-voucher.component';
import { TablaVentasComponent } from './components/pages/reports/report-ventas/partials/tabla-ventas/tabla-ventas.component';
import { FiltrosComprasComponent } from './components/pages/reports/report-compras/partials/filtros-compras/filtros-compras.component';
import { ResumenComprasComponent } from './components/pages/reports/report-compras/partials/resumen-compras/resumen-compras.component';
import { ComprasDiaComponent } from './components/pages/reports/report-compras/partials/compras-dia/compras-dia.component';
import { ComprasMesComponent } from './components/pages/reports/report-compras/partials/compras-mes/compras-mes.component';
import { TopProveedoresComponent } from './components/pages/reports/report-compras/partials/top-proveedores/top-proveedores.component';
import { EstadoComprasComponent } from './components/pages/reports/report-compras/partials/estado-compras/estado-compras.component';
import { TopProductosComprasComponent } from './components/pages/reports/report-compras/partials/top-productos-compras/top-productos-compras.component';
import { InventoryFiltersComponent } from './components/pages/reports/report-inventario/partials/inventory-filters/inventory-filters.component';
import { InventoryStockComponent } from './components/pages/reports/report-inventario/partials/inventory-stock/inventory-stock.component';
import { InventoryMovementsComponent } from './components/pages/reports/report-inventario/partials/inventory-movements/inventory-movements.component';
import { InventoryProductsComponent } from './components/pages/reports/report-inventario/partials/inventory-products/inventory-products.component';
import { InventoryLowStockComponent } from './components/pages/reports/report-inventario/partials/inventory-low-stock/inventory-low-stock.component';
import { InventoryCategoryComponent } from './components/pages/reports/report-inventario/partials/inventory-category/inventory-category.component';
import { InventoryBranchComponent } from './components/pages/reports/report-inventario/partials/inventory-branch/inventory-branch.component';
import { InventorySummaryReportComponent } from './components/pages/reports/report-inventario/partials/inventory-summary-report/inventory-summary-report.component';
import { ModalComprobanteVentaComponent } from './components/pages/ventas/modals/modal-comprobante-venta/modal-comprobante-venta.component';
import { IndexGananciasComponent } from './components/pages/reports/report-ganancias/index-ganancias/index-ganancias.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuLateralComponent,
    HeaderComponent,
    GridLoaderComponent,
    ModalDialog,
    SigninComponent,
    BandejaContratosComponent,
    BandejaAdendasComponent,
    ForgotPasswordComponent,
    RestorePasswordComponent,
    BandejaPerfilComponent,
    ModalEditarPerfilComponent,
    ModalEditarPasswordComponent,
    ModalEditarEmailComponent,
    PanelCompanyComponent,
    AdmCategoriasComponent,
    AdmMarcasComponent,
    AdmUnidadesComponent,
    AdmProductosComponent,
    ModalCategoriaComponent,
    ModalProductoComponent,
    ModalMarcaComponent,
    ModalUnidadComponent,
    AdmHeaderComponent,
    AdmPaginatorComponent,
    ProductSummaryComponent,
    ProductFiltersComponent,
    ProductTableComponent,
    ProovedorComponent,
    ModalProveedorComponent,
    BandejaComprasComponent,
    PurchaseSummaryComponent,
    PurchaseFiltersComponent,
    PurchaseTimelineComponent,
    PurchaseCardComponent,
    FormularioNuevaCompraComponent,
    VerDetalleCompraComponent,
    ModalCancelarCompraComponent,
    StepVerticalComponent,
    BandejaVentasComponent,
    FormularioNuevaVentaComponent,
    VerDetalleVentaComponent,
    ClientesComponent,
    ModalClienteComponent,
    ModalAnularVentaComponent,
    SaleCardComponent,
    SaleFiltersComponent,
    SaleSummaryComponent,
    SaleTimelineComponent,
    AdmUsuarioComponent,
    ModalUsuarioComponent,
    AdmSucursalComponent,
    ModalSucursalComponent,
    AdmStocksComponent,
    DetalleStocksComponent,
    ModalActualizarStockComponent,
    DashboardComponent,
    WelcomeCardComponent,
    SummaryCardsComponent,
    InventorySummaryComponent,
    AlertsStockComponent,
    SalesChartComponent,
    TopProductsComponent,
    TopCategoriesComponent,
    BranchPerformanceComponent,
    SalesTodayComponent,
    PurchaseTodayComponent,
    IndexVentasComponent,
    IndexComprasComponent,
    IndexInventarioComponent,
    FiltrosReporteComponent,
    ResumenReporteComponent,
    GraficoVentasDiaComponent,
    GraficoVentasMesComponent,
    TopProductosComponent,
    TopClientesComponent,
    MetodosPagoComponent,
    TiposVoucherComponent,
    TablaVentasComponent,
    FiltrosComprasComponent,
    ResumenComprasComponent,
    ComprasDiaComponent,
    ComprasMesComponent,
    TopProveedoresComponent,
    EstadoComprasComponent,
    TopProductosComprasComponent,
    InventoryFiltersComponent,
    InventoryStockComponent,
    InventoryMovementsComponent,
    InventoryProductsComponent,
    InventoryLowStockComponent,
    InventoryCategoryComponent,
    InventoryBranchComponent,
    InventorySummaryReportComponent,
    ModalComprobanteVentaComponent,
    IndexGananciasComponent,
  ],
  imports: [
    ComunModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonToggleModule,
    NgxSpinnerModule,
    NgApexchartsModule,
    ToastrModule.forRoot()
  ],
  exports: [
    HttpClientModule,
    ModalDialog,
    GridLoaderComponent,
    MenuLateralComponent,
    FontAwesomeModule,
    NgxSpinnerModule
  ],
  entryComponents: [
    ModalDialog
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: AddTokenInterceptor, multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faFileExcel);
  }
}
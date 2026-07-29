import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './components/authentication/signin/signin.component';
import { AuthGuard } from './shared/components/authentication/auth.guard';
import { ForgotPasswordComponent } from './components/authentication/forgot-password/forgot-password.component';
import { RestorePasswordComponent } from './components/authentication/restore-password/restore-password.component';
import { BandejaPerfilComponent } from './components/pages/profile/bandeja-perfil/bandeja-perfil.component';
import { PanelCompanyComponent } from './components/pages/company/panel-company/panel-company.component';
import { AdmCategoriasComponent } from './components/pages/almacen/adm-categorias/adm-categorias.component';
import { AdmMarcasComponent } from './components/pages/almacen/adm-marcas/adm-marcas.component';
import { AdmUnidadesComponent } from './components/pages/almacen/adm-unidades/adm-unidades.component';
import { AdmProductosComponent } from './components/pages/almacen/adm-productos/adm-productos.component';
import { ProovedorComponent } from './components/pages/compras/proovedor/proovedor.component';
import { BandejaComprasComponent } from './components/pages/compras/bandeja-compras/bandeja-compras.component';
import { FormularioNuevaCompraComponent } from './components/pages/compras/formulario-nueva-compra/formulario-nueva-compra.component';
import { VerDetalleCompraComponent } from './components/pages/compras/ver-detalle-compra/ver-detalle-compra.component';
import { ClientesComponent } from './components/pages/ventas/clientes/clientes.component';
import { BandejaVentasComponent } from './components/pages/ventas/bandeja-ventas/bandeja-ventas.component';
import { FormularioNuevaVentaComponent } from './components/pages/ventas/formulario-nueva-venta/formulario-nueva-venta.component';
import { VerDetalleVentaComponent } from './components/pages/ventas/ver-detalle-venta/ver-detalle-venta.component';
import { AdmUsuarioComponent } from './components/pages/usuario/adm-usuario/adm-usuario.component';
import { AdmSucursalComponent } from './components/pages/sucursal/adm-sucursal/adm-sucursal.component';
import { AdmStocksComponent } from './components/pages/almacen/adm-stocks/adm-stocks.component';
import { DetalleStocksComponent } from './components/pages/almacen/adm-stocks/partials/detalle-stocks/detalle-stocks.component';
import { DashboardComponent } from './components/pages/home/dashboard/dashboard.component';
import { IndexVentasComponent } from './components/pages/reports/report-ventas/index-ventas/index-ventas.component';
import { IndexComprasComponent } from './components/pages/reports/report-compras/index-compras/index-compras.component';
import { IndexInventarioComponent } from './components/pages/reports/report-inventario/index-inventario/index-inventario.component';
import { IndexGananciasComponent } from './components/pages/reports/report-ganancias/index-ganancias/index-ganancias.component';
import { IndexStockAlertsComponent } from './components/pages/notificaciones/alertas-stocks/index-stock-alerts/index-stock-alerts.component';
import { HelpCenterComponent } from './components/pages/widzard/help-center/help-center.component';
import { IndexVentasCreditoComponent } from './components/pages/ventas/ventas-credito/index-ventas-credito/index-ventas-credito.component';

const routes: Routes = [
  { path: 'signin', component: SigninComponent, },
  { path: 'forgot-password', component: ForgotPasswordComponent, },
  { path: 'restore-password', component: RestorePasswordComponent, },
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'mi-perfil', component: BandejaPerfilComponent, canActivate: [AuthGuard] },
  { path: 'mi-compania', component: PanelCompanyComponent, canActivate: [AuthGuard] },
  { path: 'mis-sucursales', component: AdmSucursalComponent, canActivate: [AuthGuard] },
  { path: 'mis-usuarios', component: AdmUsuarioComponent, canActivate: [AuthGuard] },
  { path: 'ayuda', component: HelpCenterComponent, canActivate: [AuthGuard] },

  //almacen
  { path: 'administracion-productos', component: AdmProductosComponent, canActivate: [AuthGuard] },
  { path: 'administracion-categorias', component: AdmCategoriasComponent, canActivate: [AuthGuard] },
  { path: 'administracion-marcas', component: AdmMarcasComponent, canActivate: [AuthGuard] },
  { path: 'administracion-unidades', component: AdmUnidadesComponent, canActivate: [AuthGuard] },
  { path: 'stock-sucursales', component: AdmStocksComponent, canActivate: [AuthGuard] },
  { path: 'stock-sucursales/:id/detalle-productos', component: DetalleStocksComponent, canActivate: [AuthGuard] },
  //compras
  { path: 'administracion-proveedores', component: ProovedorComponent, canActivate: [AuthGuard] },
  { path: 'bandeja-compras', component: BandejaComprasComponent, canActivate: [AuthGuard] },
  { path: 'bandeja-compras/nueva-compra', component: FormularioNuevaCompraComponent, canActivate: [AuthGuard] },
  { path: 'bandeja-compras/:id/detalle-compra', component: VerDetalleCompraComponent, canActivate: [AuthGuard] },
  //ventas
  { path: 'administracion-clientes', component: ClientesComponent, canActivate: [AuthGuard] },
  { path: 'bandeja-ventas', component: BandejaVentasComponent, canActivate: [AuthGuard] },
  { path: 'bandeja-ventas/nueva-venta', component: FormularioNuevaVentaComponent, canActivate: [AuthGuard] },
  { path: 'bandeja-ventas/:id/detalle-venta', component: VerDetalleVentaComponent, canActivate: [AuthGuard] },
  { path: 'bandeja-ventas/:id/pagos-ventas', component: IndexVentasCreditoComponent, canActivate: [AuthGuard] },

  //reportes
  { path: 'reporte-ganancias', component: IndexGananciasComponent, canActivate: [AuthGuard] },
  { path: 'reporte-ventas', component: IndexVentasComponent, canActivate: [AuthGuard] },
  { path: 'reporte-compras', component: IndexComprasComponent, canActivate: [AuthGuard] },
  { path: 'reporte-inventarios', component: IndexInventarioComponent, canActivate: [AuthGuard] },
  // { path: 'notificaciones-alertas', component: IndexStockAlertsComponent, canActivate: [AuthGuard] },
  {
    path: '**', pathMatch: 'full', redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

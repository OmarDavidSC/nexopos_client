import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
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

const routes: Routes = [
  { path: 'signin', component: SigninComponent, },
  { path: 'forgot-password', component: ForgotPasswordComponent, },
  { path: 'restore-password', component: RestorePasswordComponent, },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'mi-perfil', component: BandejaPerfilComponent, canActivate: [AuthGuard] },
  { path: 'mi-compania', component: PanelCompanyComponent, canActivate: [AuthGuard] },

  //almacen
  { path: 'administracion-productos', component: AdmProductosComponent, canActivate: [AuthGuard] },
  { path: 'administracion-categorias', component: AdmCategoriasComponent, canActivate: [AuthGuard] },
  { path: 'administracion-marcas', component: AdmMarcasComponent, canActivate: [AuthGuard] },
  { path: 'administracion-unidades', component: AdmUnidadesComponent, canActivate: [AuthGuard] },
  {
    path: '**', pathMatch: 'full', redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

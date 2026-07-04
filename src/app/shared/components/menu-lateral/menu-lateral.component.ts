import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit, ViewChild, Inject, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Eusuario } from '../../models/entidades/Eusuario';
import { AuthStoreService } from '../../stores/auth-store.service';
import { ECompany } from '../../models/entidades/ECompany';

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.css']
})
export class MenuLateralComponent implements OnInit {

  public Drawer: MatDrawer | undefined;
  @Output() cerrarSesion = new EventEmitter<void>();

  @ViewChild('drawer') set MatDrawer(value: MatDrawer) {
    this.Drawer = value;
  }

  UsuarioActual: Eusuario | null = null;
  RolActual: any = null;
  CompaniaActual: ECompany | null = null;

  flatMenu: { label: string; icon: string; route: string }[] = [];
  filteredMenu: { label: string; icon: string; route: string }[] = [];

  menuItems: MenuItem[] = [
    {
      label: 'Home',
      icon: 'home',
      route: '/bandeja-contratos'
    },
    {
      label: 'Mi Espacio',
      icon: 'space_dashboard',
      children: [
        { label: 'Mi Compañia', icon: 'corporate_fare', route: '/mi-compania' },
        { label: 'Mi Perfil', icon: 'account_circle', route: '/mi-perfil' },
      ]
    },
    {
      label: 'Administraciones',
      icon: 'settings',
      children: [
        { label: 'Áreas', icon: 'business', route: '/administracion-areas' },
        { label: 'Cargos', icon: 'badge', route: '/administracion-cargos' },
        { label: 'Usuarios', icon: 'people', route: '/administracion-usuarios' }
      ]
    },
    // {
    //   label: 'Adm. Asistencias',
    //   icon: 'assignment',
    //   children: [
    //     { label: 'Horarios', icon: 'schedule', route: '/administracion-horarios' },
    //     { label: 'Feriados', icon: 'event_busy', route: '/administracion-feriados' }
    //   ]
    // },
    {
      label: 'Gestión de Incidencias',
      icon: 'build_circle',
      children: [
        { label: 'Incidencias', icon: 'support_agent', route: '/bandeja-incidencias' },
        { label: 'Tipos de Incidencia', icon: 'category', route: '/administracion-tipos-incidencia' },
        { label: 'Reporte General', icon: 'assessment', route: '/reporte-general' },
        { label: 'Reporte Avanzado', icon: 'analytics', route: '/reporte-avanzado' },
        { label: 'Reporte Pago Incidencia', icon: 'receipt_long', route: '/reporte-pagos-incidencias' },
      ]
    },
    // {
    //   label: 'Reportes',
    //   icon: 'assessment',
    //   children: [
    //     { label: 'Reporte General', icon: 'bar_chart', route: '/reporte-general' },
    //     { label: 'Estadísticas', icon: 'pie_chart', route: '/estadisticas' }
    //   ]
    // },
    // {
    //   label: 'Dashboard',
    //   icon: 'grid_view',
    //   children: [
    //     { label: 'Sub Dashboard', icon: 'view_module', route: '/sub-dashboard' }
    //   ]
    // }
  ];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinnerService: NgxSpinnerService,
    private authService: AuthService,
    private authStore: AuthStoreService
  ) { }

  ngOnDestroy(): void {
  }

  async ngOnInit(): Promise<void> {
    this.UsuarioActual = this.authStore.getUser();
    this.CompaniaActual = this.authStore.getCompany();
    this.RolActual = this.authStore.getRole();
    this.buildFlatMenu();
    this.filteredMenu = [...this.flatMenu];
  }

  buildFlatMenu() {
    this.flatMenu = [];
    this.menuItems.forEach(item => {
      if (item.route) {
        this.flatMenu.push({ label: item.label, icon: item.icon, route: item.route });
      }
      if (item.children) {
        item.children.forEach(child => {
          this.flatMenu.push({ label: child.label, icon: child.icon, route: child.route });
        });
      }
    });
  }

  irAPerfil() {
    this.router.navigate(['/mi-perfil']);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    this.Drawer?.toggle();
  }

  OnClickLogout() {
    this.authService.logout();
    this.cerrarSesion.emit();
  }
}

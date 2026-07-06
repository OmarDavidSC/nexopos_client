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
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    {
      label: 'Mi Empresa',
      icon: 'business',
      children: [
        { label: 'Mi Compañía', icon: 'corporate_fare', route: '/mi-compania' },
        { label: 'Mi Perfil', icon: 'account_circle', route: '/mi-perfil' }
      ]
    },
    {
      label: 'Almacén',
      icon: 'inventory_2',
      children: [
        { label: 'Productos', icon: 'inventory', route: '/administracion-productos' },
        { label: 'Categorías', icon: 'category', route: '/administracion-categorias' },
        { label: 'Marcas', icon: 'branding_watermark', route: '/administracion-marcas' },
        { label: 'Unidades', icon: 'straighten', route: '/administracion-unidades' }
      ]
    },
    {
      label: 'Compras',
      icon: 'shopping_cart',
      children: [
        { label: 'Proveedores', icon: 'local_shipping', route: '/administracion-proveedores' },
        { label: 'Compras', icon: 'receipt_long', route: '/compras' }
      ]
    },
    {
      label: 'Ventas',
      icon: 'point_of_sale',
      children: [
        { label: 'Clientes', icon: 'groups', route: '/administracion-clientes' },
        { label: 'Punto de Venta', icon: 'point_of_sale', route: '/ventas' }
      ]
    },
    {
      label: 'Caja',
      icon: 'payments',
      children: [
        { label: 'Caja', icon: 'account_balance_wallet', route: '/caja' },
        { label: 'Movimientos', icon: 'swap_horiz', route: '/movimientos-caja' }
      ]
    },
    {
      label: 'Reportes',
      icon: 'assessment',
      children: [
        { label: 'Ventas', icon: 'bar_chart', route: '/reporte-ventas' },
        { label: 'Compras', icon: 'shopping_bag', route: '/reporte-compras' },
        { label: 'Inventario', icon: 'inventory', route: '/reporte-inventario' }
      ]
    }
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

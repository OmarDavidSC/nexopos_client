import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HelpTutorial } from 'src/app/shared/models/base/HelpTutorial';
import { ModalHelpTutorialComponent } from './modals/modal-help-tutorial/modal-help-tutorial.component';

interface VersionFeature {
  id: number;
  titulo: string;
  descripcion: string;
  icono: string;
  funciones: string[];
  tutorial?: boolean;
}

@Component({
  selector: 'app-help-center',
  templateUrl: './help-center.component.html',
  styleUrls: ['./help-center.component.scss']
})
export class HelpCenterComponent implements OnInit {

  VersionActual: string = 'v1.1.0';

  FuncionesVersion: VersionFeature[] = [
    {
      id: 1,
      titulo: 'Configura tu perfil',
      descripcion: 'Administra tus datos personales y la información asociada a tu cuenta.',
      icono: 'account_circle',
      funciones: [
        'Actualizar datos personales',
        'Administrar información de la cuenta',
        'Cambiar credenciales de acceso'
      ]
    },
    {
      id: 2,
      titulo: 'Configura tu empresa y sucursales',
      descripcion: 'Registra los datos del negocio y organiza sus diferentes puntos de atención.',
      icono: 'store',
      funciones: [
        'Datos generales de la empresa',
        'Registro de sucursales',
        'Asignación de usuarios por sucursal'
      ]
    },
    {
      id: 3,
      titulo: 'Administra usuarios y permisos',
      descripcion: 'Controla el acceso de los trabajadores y las funciones que pueden utilizar.',
      icono: 'manage_accounts',
      funciones: [
        'Registro de usuarios',
        'Asignación de roles',
        'Control por sucursal'
      ]
    },
    {
      id: 4,
      titulo: 'Organiza tu catálogo',
      descripcion: 'Prepara los productos que utilizarás en las compras, ventas e inventario.',
      icono: 'inventory_2',
      funciones: [
        'Productos',
        'Categorías',
        'Marcas',
        'Unidades de medida',
        'Precios de compra y venta'
      ]
    },
    {
      id: 5,
      titulo: 'Registra clientes',
      descripcion: 'Administra la información de las personas y empresas que compran en tu negocio.',
      icono: 'groups',
      funciones: [
        'DNI, RUC, CE y pasaporte',
        'Teléfono y correo',
        'Dirección del cliente',
        'Selección rápida durante la venta'
      ]
    },
    {
      id: 6,
      titulo: 'Registra proveedores y compras',
      descripcion: 'Controla el ingreso de mercadería y actualiza automáticamente las existencias.',
      icono: 'shopping_cart',
      funciones: [
        'Administración de proveedores',
        'Registro de compras',
        'Detalle de productos comprados',
        'Actualización automática del stock'
      ]
    },
    {
      id: 7,
      titulo: 'Controla el inventario por sucursal',
      descripcion: 'Consulta el stock y todos los movimientos generados en cada local.',
      icono: 'warehouse',
      funciones: [
        'Stock actual por sucursal',
        'Productos con stock bajo',
        'Entradas y salidas',
        'Compras, ventas y ajustes',
        'Filtros por producto y fechas'
      ]
    },
    {
      id: 8,
      titulo: 'Registra una venta',
      descripcion: 'Selecciona el cliente, agrega productos, define el pago y emite el comprobante.',
      icono: 'point_of_sale',
      tutorial: true,
      funciones: [
        'Ventas por sucursal',
        'Control automático del stock',
        'Boleta, factura y ticket',
        'Efectivo, tarjeta, transferencia, Yape y Plin',
        'Impresión y envío del comprobante'
      ]
    },
    {
      id: 9,
      titulo: 'Emite comprobantes electrónicos',
      descripcion: 'Envía boletas y facturas electrónicas y consulta su resultado.',
      icono: 'receipt_long',
      funciones: [
        'Integración con SUNAT',
        'Estado aprobado o pendiente',
        'PDF en diferentes formatos',
        'Impresión de 58 mm, 80 mm, A5 y A4'
      ]
    },
    {
      id: 10,
      titulo: 'Controla y anula ventas',
      descripcion: 'Consulta las operaciones realizadas y anula una venta cuando sea necesario.',
      icono: 'history',
      funciones: [
        'Historial de ventas',
        'Detalle de la operación',
        'Anulación de ventas',
        'Reposición automática del stock'
      ]
    },
    {
      id: 11,
      titulo: 'Consulta tus ganancias',
      descripcion: 'Conoce cuánto compraste, cuánto vendiste y cuál fue la utilidad obtenida.',
      icono: 'trending_up',
      funciones: [
        'Ganancia por producto',
        'Ganancia diaria',
        'Comparación entre compra y venta',
        'Resultados por sucursal',
        'Filtros por fechas'
      ]
    },
    {
      id: 12,
      titulo: 'Analiza los reportes',
      descripcion: 'Revisa indicadores importantes para tomar mejores decisiones en el negocio.',
      icono: 'analytics',
      funciones: [
        'Resumen del inventario',
        'Movimientos por fechas',
        'Stock por producto',
        'Productos con pocas existencias',
        'Información por categoría y sucursal'
      ]
    }
  ];

  TutorialVenta: HelpTutorial = {
    id: 1,
    titulo: 'Registrar una venta',
    descripcion: 'Aprende a registrar productos, clientes, métodos de pago y comprobantes en NexoPOS.',
    categoria: 'Ventas',
    icono: 'point_of_sale',
    duracion: '3 min',
    tipo: 'INTERACTIVO',
    pasos: [
      {
        id: 1,
        titulo: 'Ingresar al módulo de ventas',
        descripcion: 'Desde el menú principal, ingresa a Ventas y selecciona la opción Nueva venta.',
        imagen: 'assets/img/tutoriales/ventas/paso-1.png',
        icono: 'point_of_sale',
        recomendacion: 'También puedes ingresar desde el acceso rápido Nueva venta del panel principal.'
      },
      {
        id: 2,
        titulo: 'Seleccionar al cliente',
        descripcion: 'Busca al cliente por nombre, DNI o RUC. Si no existe, puedes registrarlo desde la misma pantalla.',
        imagen: 'assets/img/tutoriales/ventas/paso-2.png',
        icono: 'person_search',
        recomendacion: 'Para ventas rápidas puedes utilizar el cliente general cuando el comprobante lo permita.'
      },
      {
        id: 3,
        titulo: 'Agregar los productos',
        descripcion: 'Busca el producto por nombre o código, selecciona la cantidad y agrégalo al detalle.',
        imagen: 'assets/img/tutoriales/ventas/paso-3.png',
        icono: 'add_shopping_cart',
        recomendacion: 'Verifica el stock disponible antes de agregar el producto.'
      },
      {
        id: 4,
        titulo: 'Revisar cantidades y precios',
        descripcion: 'Comprueba los productos, cantidades, precios, descuentos y subtotales.',
        imagen: 'assets/img/tutoriales/ventas/paso-4.png',
        icono: 'fact_check',
        recomendacion: 'Puedes modificar la cantidad o eliminar un producto antes de registrar la venta.'
      },
      {
        id: 5,
        titulo: 'Seleccionar comprobante y pago',
        descripcion: 'Elige el tipo de comprobante y el método de pago utilizado por el cliente.',
        imagen: 'assets/img/tutoriales/ventas/paso-5.png',
        icono: 'receipt_long',
        recomendacion: 'Para emitir una factura, el cliente debe tener un RUC válido.'
      },
      {
        id: 6,
        titulo: 'Confirmar la venta',
        descripcion: 'Revisa el total y presiona Registrar venta. Luego podrás imprimir o compartir el comprobante.',
        imagen: 'assets/img/tutoriales/ventas/paso-6.png',
        icono: 'check_circle',
        recomendacion: 'Espera a que el sistema termine de procesar el comprobante antes de cerrar la ventana.'
      }
    ]
  };

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void { }

  seleccionarFuncion(funcion: VersionFeature): void {
    if (funcion.tutorial) {
      this.abrirTutorialVenta();
    }
  }

  abrirTutorialVenta(): void {
    this.dialog.open(ModalHelpTutorialComponent, {
      width: '1050px',
      maxWidth: '96vw',
      maxHeight: '94vh',
      panelClass: 'help-tutorial-dialog',
      autoFocus: false,
      data: this.TutorialVenta
    });
  }
}
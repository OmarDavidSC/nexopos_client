import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

export interface InventoryStock {
  id: number;
  code: string;
  name: string;
  branch_name: string;
  current_stock: number | string;
  minimum_stock: number | string;
}

@Component({
  selector: 'app-inventory-stock',
  templateUrl: './inventory-stock.component.html',
  styleUrls: ['./inventory-stock.component.scss']
})
export class InventoryStockComponent implements OnChanges, AfterViewInit {

  @Input() stock: InventoryStock[] = [];
  @Input() loading: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'code',
    'product',
    'branch',
    'current_stock',
    'minimum_stock',
    'status'
  ];

  dataSource: MatTableDataSource<InventoryStock> = new MatTableDataSource<InventoryStock>([]);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stock']) {
      this.dataSource.data = this.stock ?? [];

      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
        this.paginator.firstPage();
      }
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  aplicarBusqueda(event: Event): void {
    const value: string = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  obtenerStockActual(item: InventoryStock): number {
    return Number(item.current_stock ?? 0);
  }

  obtenerStockMinimo(item: InventoryStock): number {
    return Number(item.minimum_stock ?? 0);
  }

  obtenerEstado(item: InventoryStock): string {
    const actual: number = this.obtenerStockActual(item);
    const minimo: number = this.obtenerStockMinimo(item);

    if (actual <= 0) {
      return 'SIN_STOCK';
    }

    if (minimo > 0 && actual <= minimo) {
      return 'BAJO';
    }

    if (minimo > 0 && actual <= minimo * 1.5) {
      return 'MEDIO';
    }

    return 'DISPONIBLE';
  }

  obtenerEstadoTexto(item: InventoryStock): string {
    const estado: string = this.obtenerEstado(item);

    const estados: { [key: string]: string } = {
      SIN_STOCK: 'Sin stock',
      BAJO: 'Stock bajo',
      MEDIO: 'Stock limitado',
      DISPONIBLE: 'Disponible'
    };

    return estados[estado] ?? 'Dispon ible';
  }

  obtenerPorcentaje(item: InventoryStock): number {
    const actual: number = this.obtenerStockActual(item);
    const minimo: number = this.obtenerStockMinimo(item);

    if (actual <= 0) {
      return 0;
    }

    if (minimo <= 0) {
      return 100;
    }

    return Math.min((actual / (minimo * 2)) * 100, 100);
  }

}

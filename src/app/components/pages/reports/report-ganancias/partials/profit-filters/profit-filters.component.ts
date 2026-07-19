import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ReportProfitFilter } from 'src/app/shared/models/base/ReportProfitFilter';
import { ECategoria } from 'src/app/shared/models/entidades/ECategoria';
import { EProducto } from 'src/app/shared/models/entidades/EProducto';
import { ESucursal } from 'src/app/shared/models/entidades/ESucursal';

@Component({
  selector: 'app-profit-filters',
  templateUrl: './profit-filters.component.html',
  styleUrls: ['./profit-filters.component.scss']
})
export class ProfitFiltersComponent {

  FechaInicio: Date | null = null;
  FechaFin: Date | null = null;

  @Input() filtro: ReportProfitFilter = {
    branch_id: null,
    product_id: null,
    category_id: null,
    date_start: null,
    date_end: null
  };

  @Input() sucursales: ESucursal[] = [];
  // @Input() productos: EProducto[] = [];
  // @Input() categorias: ECategoria[] = [];
  @Input() loading: boolean = false;

  @Output() buscar = new EventEmitter<ReportProfitFilter>();
  @Output() limpiar = new EventEmitter<void>();

  FiltroLocal: ReportProfitFilter = {
    branch_id: null,
    product_id: null,
    category_id: null,
    date_start: null,
    date_end: null
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filtro'] && this.filtro) {
      this.FiltroLocal = {
        ...this.filtro
      };

      this.FechaInicio = this.parseDate(this.filtro.date_start);
      this.FechaFin = this.parseDate(this.filtro.date_end);
    }
  }
  onBuscar(): void {
    if (!this.fechasValidas) {
        return;
    }

    this.buscar.emit({
        ...this.FiltroLocal,
        date_start: this.formatDate(this.FechaInicio),
        date_end: this.formatDate(this.FechaFin)
    });
}

  onLimpiar(): void {
    this.FiltroLocal = {
      branch_id: null,
      product_id: null,
      category_id: null,
      date_start: null,
      date_end: null
    };

    this.FechaInicio = null;
    this.FechaFin = null;
    this.limpiar.emit();
  }
  
  private formatDate(date: Date | null): string | null {
    if (!date) {
      return null;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private parseDate(value: string | null): Date | null {
    if (!value) {
      return null;
    }
    const parts = value.split('-');
    if (parts.length !== 3) {
      return null;
    }
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }

  get fechasValidas(): boolean {
    if (!this.FechaInicio || !this.FechaFin) {
      return true;
    }
    return this.FechaInicio <= this.FechaFin;
  }
}

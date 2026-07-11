import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ECompany } from 'src/app/shared/models/entidades/ECompany';
import { EProducto } from 'src/app/shared/models/entidades/EProducto';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss']
})
export class ProductTableComponent {

  @Input() products: EProducto[] = [];
  @Input() companiaActual: ECompany;
  @Input() loading: boolean = false;
  @Input() total: number = 0;
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Output() edit = new EventEmitter<EProducto>();
  @Output() remove = new EventEmitter<EProducto>();
  @Output() pageChange = new EventEmitter<number>();
}

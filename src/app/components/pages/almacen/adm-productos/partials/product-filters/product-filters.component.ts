import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductFilter } from 'src/app/shared/models/base/ProductFilter';

@Component({
  selector: 'app-product-filters',
  templateUrl: './product-filters.component.html',
  styleUrls: ['./product-filters.component.scss']
})
export class ProductFiltersComponent {

  @Input() filter!: ProductFilter;
  @Input() categories: any[] = [];
  @Input() brands: any[] = [];
  @Output() search = new EventEmitter<void>();
  @Output() categoryChange = new EventEmitter<void>();
  @Output() brandChange = new EventEmitter<void>();
  @Output() statusChange = new EventEmitter<void>();
  @Output() clear = new EventEmitter<void>();
}

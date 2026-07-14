import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tipos-voucher',
  templateUrl: './tipos-voucher.component.html',
  styleUrls: ['./tipos-voucher.component.scss']
})
export class TiposVoucherComponent {


  @Input() Datos: any[] = [];

}

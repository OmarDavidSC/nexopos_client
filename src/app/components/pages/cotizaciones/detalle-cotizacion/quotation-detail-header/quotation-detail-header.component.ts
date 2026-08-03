import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-quotation-detail-header',
  templateUrl: './quotation-detail-header.component.html',
  styleUrls: ['./quotation-detail-header.component.scss']
})
export class QuotationDetailHeaderComponent {

  @Input() quotation: any = null;
  @Input() sale: any = null;

  @Output() back = new EventEmitter<void>();

  get statusLabel(): string {
    const labels: Record<string, string> = {
      DRAFT: 'Borrador',
      SENT: 'Enviada',
      ACCEPTED: 'Aceptada',
      REJECTED: 'Rechazada',
      EXPIRED: 'Vencida',
      CANCELLED: 'Cancelada',
      CONVERTED: 'Convertida'
    };
    return labels[this.quotation?.status] ?? this.quotation?.status ?? '-';
  }
}

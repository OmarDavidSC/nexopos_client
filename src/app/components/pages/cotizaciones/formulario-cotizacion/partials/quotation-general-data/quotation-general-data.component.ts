import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ECompany } from 'src/app/shared/models/entidades/ECompany';

@Component({
  selector: 'app-quotation-general-data',
  templateUrl: './quotation-general-data.component.html',
  styleUrls: ['./quotation-general-data.component.scss'],
})
export class QuotationGeneralDataComponent {
  @Input() cotizacion: any = {
    quotation_series: 'COT',
    issue_date: new Date(),
    expiration_date: null,
    status: 'DRAFT',
    observations: '',
    terms: '',
  };

  @Input() compania: ECompany | null = null;
  @Output() cotizacionChange = new EventEmitter<any>();
  @Output() fechaEmisionChange = new EventEmitter<void>();

  OnEventoCambiarCampo(): void {
    this.cotizacionChange.emit({ ...this.cotizacion, });
  }

  OnEventoCambiarFechaEmision(): void {
    this.OnEventoCambiarCampo();
    this.fechaEmisionChange.emit();
  }

  OnEventoCambiarFechaVencimiento(): void {
    this.OnEventoCambiarCampo();
  }

  get FechaMinimaVencimiento(): Date | null {
    if (!this.cotizacion?.issue_date) {
      return null;
    }
    return new Date(this.cotizacion.issue_date);
  }

  get DiasVigencia(): number {
    if (!this.cotizacion?.issue_date || !this.cotizacion?.expiration_date) {
      return 0;
    }
    const fechaEmision = new Date(this.cotizacion.issue_date);
    const fechaVencimiento = new Date(this.cotizacion.expiration_date);
    fechaEmision.setHours(0, 0, 0, 0);
    fechaVencimiento.setHours(0, 0, 0, 0);
    const diferencia = fechaVencimiento.getTime() - fechaEmision.getTime();
    return Math.max(Math.ceil(diferencia / (1000 * 60 * 60 * 24)), 0);
  }
}

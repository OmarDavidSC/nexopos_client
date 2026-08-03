import { Component, Input, OnInit } from '@angular/core';

interface QuotationStep {
  status: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-quotation-status-flow',
  templateUrl: './quotation-status-flow.component.html',
  styleUrls: ['./quotation-status-flow.component.scss']
})
export class QuotationStatusFlowComponent {

  @Input() status: string = 'DRAFT';

  readonly steps: QuotationStep[] = [
    {
      status: 'DRAFT',
      label: 'Borrador',
      icon: 'edit_note'
    },
    {
      status: 'SENT',
      label: 'Enviada',
      icon: 'send'
    },
    {
      status: 'ACCEPTED',
      label: 'Aceptada',
      icon: 'verified'
    },
    {
      status: 'CONVERTED',
      label: 'Convertida',
      icon: 'point_of_sale'
    }
  ];

  get normalizedStatus(): string {
    return String(this.status || 'DRAFT').toUpperCase();
  }

  get currentIndex(): number {
    const index = this.steps.findIndex(
      step => step.status === this.normalizedStatus
    );

    if (index >= 0) {
      return index;
    }

    if (
      ['REJECTED', 'EXPIRED', 'CANCELLED']
        .includes(this.normalizedStatus)
    ) {
      return 1;
    }

    return 0;
  }

  get progressPercentage(): number {
    if (this.steps.length <= 1) {
      return 0;
    }

    const progress =
      (this.currentIndex / (this.steps.length - 1)) * 100;

    return Math.max(0, Math.min(progress, 100));
  }

  isCompleted(index: number): boolean {
    return (
      !this.isSpecialStatus() &&
      index < this.currentIndex
    );
  }

  isActive(index: number): boolean {
    return (
      !this.isSpecialStatus() &&
      index === this.currentIndex
    );
  }

  isPending(index: number): boolean {
    return (
      !this.isSpecialStatus() &&
      index > this.currentIndex
    );
  }

  isStepDisabled(index: number): boolean {
    return (
      this.isSpecialStatus() &&
      index > this.currentIndex
    );
  }

  isSpecialStatus(): boolean {
    return [
      'REJECTED',
      'EXPIRED',
      'CANCELLED'
    ].includes(this.normalizedStatus);
  }

  get currentStatusLabel(): string {
    const labels: Record<string, string> = {
      DRAFT: 'Borrador',
      SENT: 'Enviada',
      ACCEPTED: 'Aceptada',
      CONVERTED: 'Convertida',
      REJECTED: 'Rechazada',
      EXPIRED: 'Vencida',
      CANCELLED: 'Cancelada'
    };

    return labels[this.normalizedStatus] ?? 'Sin estado';
  }

  get currentStatusIcon(): string {
    const icons: Record<string, string> = {
      DRAFT: 'edit_note',
      SENT: 'send',
      ACCEPTED: 'verified',
      CONVERTED: 'point_of_sale',
      REJECTED: 'cancel',
      EXPIRED: 'event_busy',
      CANCELLED: 'block'
    };

    return icons[this.normalizedStatus] ?? 'help_outline';
  }

  get specialLabel(): string {
    const labels: Record<string, string> = {
      REJECTED: 'Cotización rechazada',
      EXPIRED: 'Cotización vencida',
      CANCELLED: 'Cotización cancelada'
    };

    return labels[this.normalizedStatus] ?? '';
  }

  get specialDescription(): string {
    const descriptions: Record<string, string> = {
      REJECTED:
        'El cliente rechazó la propuesta y el flujo fue detenido.',
      EXPIRED:
        'La fecha de vigencia terminó y la cotización ya no puede continuar.',
      CANCELLED:
        'La cotización fue cancelada y no puede convertirse en venta.'
    };

    return descriptions[this.normalizedStatus] ?? '';
  }

  get specialIcon(): string {
    const icons: Record<string, string> = {
      REJECTED: 'cancel',
      EXPIRED: 'event_busy',
      CANCELLED: 'block'
    };

    return icons[this.normalizedStatus] ?? 'warning';
  }

}

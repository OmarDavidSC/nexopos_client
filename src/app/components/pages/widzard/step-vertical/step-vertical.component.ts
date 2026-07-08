import { Component, Input, OnInit } from '@angular/core';

export type StepStatus = 'pending' | 'active' | 'completed' | 'error';

export interface StepVertical {
  title: string;
  description?: string;
  status: StepStatus;
}

@Component({
  selector: 'app-step-vertical',
  templateUrl: './step-vertical.component.html',
  styleUrls: ['./step-vertical.component.scss']
})
export class StepVerticalComponent {

  @Input() steps: StepVertical[] = [];

  getIcon(status: StepStatus): string {
    switch (status) {
      case 'completed':
        return '✓';
      case 'active':
        return '●';
      case 'error':
        return '✕';
      default:
        return '○';
    }
  }

}

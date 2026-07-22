import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HelpTutorial, HelpTutorialStep } from 'src/app/shared/models/base/HelpTutorial';

@Component({
  selector: 'app-modal-help-tutorial',
  templateUrl: './modal-help-tutorial.component.html',
  styleUrls: ['./modal-help-tutorial.component.scss']
})
export class ModalHelpTutorialComponent {
  PasoActual: number = 0;

  constructor(
    private dialogRef: MatDialogRef<ModalHelpTutorialComponent>,
    @Inject(MAT_DIALOG_DATA) public Tutorial: HelpTutorial
  ) { }

  get PasoSeleccionado(): HelpTutorialStep {
    return this.Tutorial.pasos[this.PasoActual];
  }

  get TotalPasos(): number {
    return this.Tutorial.pasos.length;
  }

  get PorcentajeProgreso(): number {
    if (!this.TotalPasos) {
      return 0;
    }

    return ((this.PasoActual + 1) / this.TotalPasos) * 100;
  }

  get EsPrimerPaso(): boolean {
    return this.PasoActual === 0;
  }

  get EsUltimoPaso(): boolean {
    return this.PasoActual === this.TotalPasos - 1;
  }

  get TextoProgreso(): string {
    return `${this.PasoActual + 1} de ${this.TotalPasos}`;
  }

  seleccionarPaso(index: number): void {
    if (index < 0 || index >= this.TotalPasos) {
      return;
    }

    this.PasoActual = index;
  }

  anterior(): void {
    if (this.EsPrimerPaso) {
      return;
    }

    this.PasoActual--;
  }

  siguiente(): void {
    if (this.EsUltimoPaso) {
      this.finalizar();
      return;
    }

    this.PasoActual++;
  }

  finalizar(): void {
    this.dialogRef.close({
      completado: true,
      tutorialId: this.Tutorial.id
    });
  }

  cerrar(): void {
    this.dialogRef.close({
      completado: false,
      tutorialId: this.Tutorial.id
    });
  }
}

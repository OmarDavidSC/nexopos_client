import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-html-viewer',
  templateUrl: './modal-html-viewer.component.html',
  styleUrls: ['./modal-html-viewer.component.scss']
})
export class ModalHtmlViewerComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

}

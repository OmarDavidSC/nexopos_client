import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-categories',
  templateUrl: './top-categories.component.html',
  styleUrls: ['./top-categories.component.scss']
})
export class TopCategoriesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() data: any[] = [];

}

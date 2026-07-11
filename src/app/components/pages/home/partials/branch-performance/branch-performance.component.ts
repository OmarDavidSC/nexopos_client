import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-branch-performance',
  templateUrl: './branch-performance.component.html',
  styleUrls: ['./branch-performance.component.scss']
})
export class BranchPerformanceComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() data: any[] = [];
  @Input() moneda: string;

}

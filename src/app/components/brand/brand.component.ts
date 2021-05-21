import { Component, Input } from '@angular/core';

enum direction {
  ROW,
  COLUMN,
}

@Component({
  selector: 'elder-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss'],
})
export class BrandComponent {
  @Input() direction: direction | 'column' | 'row' = direction.ROW;
  @Input() fontRem: number = 3.5;
  @Input() logoRem: number = 3.5;
  @Input() gapRem: number = 1;
  constructor() {}
}

import { Component, Input } from '@angular/core';

enum orientation {
  ROW,
  COLUMN,
}

@Component({
  selector: 'elder-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss', './_logo.brand.component.scss'],
})
export class BrandComponent {
  @Input() orientation: orientation | 'column' | 'row' = orientation.ROW;
  @Input() fontRem: number = 3.5;
  @Input() logoRem: number = 3.5;
  @Input() gapRem: number = 1;

  constructor() {}
}

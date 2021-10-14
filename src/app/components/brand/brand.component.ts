import { Component, HostBinding, Input } from '@angular/core';

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
  @HostBinding('style.--orientation')
  @Input()
  orientation: orientation | 'column' | 'row' = orientation.COLUMN;
  @HostBinding('style.--font-size')
  @Input()
  fontSize: string = '3.5rem';
  @HostBinding('style.--logo-size')
  @Input()
  logoSize: string = '3.5rem';
  @Input() showTitle: boolean = true;
  constructor() {}
}

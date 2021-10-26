import { Component, Input } from '@angular/core';

@Component({
  selector: 'elder-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss'],
})
export class BrandComponent {
  @Input() showTitle: boolean = true;
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'elder-range-card',
  templateUrl: './detail-range-card.component.html',
  styleUrls: ['./detail-range-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeCardComponent {
  @Input() field: string = '';
  @Input() entry: string = '';
  @Input() icon: string = '';
  @Input() filter: string = '';
  @Input() units: string = '';
  @Input() maximum: number;
  @Input() minimum: number;
  @Input() recommendation: string = '';
  get min() {
    return `${this.minimum} ${this.units}`;
  }
  get max() {
    return `${this.maximum} ${this.units}`;
  }
  constructor() {}
}

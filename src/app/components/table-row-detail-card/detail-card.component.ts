import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'elder-detail-card',
  templateUrl: './detail-card.component.html',
  styleUrls: ['./detail-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowDetailCardComponent {
  @Input() field: string = '';
  @Input() entry: string = '';
  @Input() icon: string = '';
  @Input() filter: string = '';
  constructor() {}
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'elder-entry-card',
  templateUrl: './entry-card.component.html',
  styleUrls: ['./entry-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpandedRowCardComponent {
  @Input() field: string = '';
  @Input() entry: string = '';
  @Input() icon: string = '';
  @Input() filter: string = '';
  constructor() {}
}

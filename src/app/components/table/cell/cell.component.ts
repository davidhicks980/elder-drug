import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

export enum TableCell {
  HEADER,
  DATA,
}
@Component({
  selector: 'elder-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CellComponent {
  @Input('wrapContent') wrap: boolean = false;
  @Input('toggle') showToggle: boolean = false;
  @HostBinding('class.is-wrapped') get wrapped() {
    return this.wrap;
  }
}

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
  @Input() type: TableCell = TableCell.DATA;
  @HostBinding('class.is-header') get isHeader() {
    return this.type === TableCell.HEADER;
  }
  @HostBinding('class.is-data') get isData() {
    return this.type === TableCell.DATA;
  }
}

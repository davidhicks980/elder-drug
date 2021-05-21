import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'elder-expanded-row-card',
  templateUrl: './expanded-row-card.component.html',
  styleUrls: ['./expanded-row-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpandedRowCardComponent implements OnInit {
  @Input() field: string = '';
  @Input() entry: string = '';
  @Input() icon: string = '';

  constructor() {}

  ngOnInit(): void {}
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Table } from '../../../services/firebase.service';

@Component({
  selector: 'elder-expanded-element',
  templateUrl: './expanded-element.component.html',
  styleUrls: ['./expanded-element.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpandedElementComponent {
  @Input() expansionData: Table;
  constructor() {}
  ngAfterViewInit() {
    console.log(this.expansionData);
  }
}

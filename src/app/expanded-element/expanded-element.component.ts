import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Table } from '../firebase.service';

@Component({
  selector: 'app-expanded-element',
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

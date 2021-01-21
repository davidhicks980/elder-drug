import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { Table } from '../firebase.service';

@Component({
  selector: 'app-expanded-element',
  templateUrl: './expanded-element.component.html',
  styleUrls: ['./expanded-element.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpandedElementComponent implements OnInit {
  @Input() expansionData: Table;
  constructor() {}
  ngAfterViewInit() {
    console.log(this.expansionData);
  }
}

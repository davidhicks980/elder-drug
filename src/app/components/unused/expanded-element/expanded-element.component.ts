import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { BeersField } from '../../../services/data.service';

@Component({
  selector: 'elder-expanded-element',
  templateUrl: './expanded-element.component.html',
  styleUrls: ['./expanded-element.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpandedElementComponent {
  @Input() expansionData: BeersField;
  constructor() {}
  ngAfterViewInit() {}
}

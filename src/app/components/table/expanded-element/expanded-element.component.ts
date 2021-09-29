import { trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { enterLeaveFadeTemplate, flyInTemplate } from '../../../animations/templates';
import { FilterService } from '../../../services/filter.service';
import { ExpandingEntry } from '../../table/ExpandingEntry';

@Component({
  selector: 'elder-expanded-element',
  templateUrl: './expanded-element.component.html',
  styleUrls: ['./expanded-element.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeIn', enterLeaveFadeTemplate('1s', '1s')),
    trigger(
      'flyIn',
      flyInTemplate({
        enter: {
          startX: '0px',
          startY: '-20%',
          endX: '0px',
          endY: '0px',
        },
        enterTiming: '200ms ease',
        leave: {
          startX: '0px',
          startY: '0px',
          endX: '0px',
          endY: '-100%',
        },
        leaveTiming: '200ms ease-in',
      })
    ),
  ],
})
export class ExpandedElementComponent {
  private _data: Partial<ExpandingEntry>;
  map: { description: string; value: string }[];
  filter: Observable<string>;
  @Input()
  public get data(): Partial<ExpandingEntry> {
    return this._data;
  }
  public set data(value: Partial<ExpandingEntry>) {
    this._data = value;
  }
  constructor(public filterService: FilterService) {
    this.filter = this.filterService.filter$;
  }
}

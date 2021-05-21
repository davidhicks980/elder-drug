import { trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';

import { fadeInTemplate, flyInTemplate } from '../../../animations';
import { ExpandingEntry } from '../../table/table.component';

@Component({
  selector: 'elder-expanded-element',
  templateUrl: './expanded-element.component.html',
  styleUrls: ['./expanded-element.component.scss'],
  animations: [
    trigger('fadeIn', fadeInTemplate('1s', '1s')),
    trigger(
      'flyIn',
      flyInTemplate(
        {
          startX: '0px',
          startY: '-20%',
          endX: '0px',
          endY: '0px',
          timing: '200ms ease',
        },
        {
          startX: '0px',
          startY: '0px',
          endX: '0px',
          endY: '-100%',
          timing: '200ms ease-in',
        }
      )
    ),
  ],
})
export class ExpandedElementComponent {
  private _data: ExpandingEntry;
  map: { description: string; value: string }[];

  @Input()
  public get data(): ExpandingEntry {
    return this._data;
  }
  public set data(value: ExpandingEntry) {
    this._data = value;
  }

  constructor() {}
}

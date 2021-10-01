import { trigger } from '@angular/animations';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { flyInTemplate } from '../../../animations/templates';
import { FilterService } from '../../../services/filter.service';
import { BeersSearchResult } from '../../../services/search.service';

@Component({
  selector: 'elder-expanded-element',
  templateUrl: './expanded-element.component.html',
  styleUrls: ['./expanded-element.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger(
      'flyIn',
      flyInTemplate({
        enter: { startY: '-20px', endY: '0px', startX: '0px', endX: '0px' },
        enterTiming: '250ms ease-in',
      })
    ),
  ],
})
export class ExpandedElementComponent<T extends BeersSearchResult> implements AfterViewInit {
  private dataValue: T;
  @Input() get data(): T {
    return this.dataValue;
  }
  set data(value: T) {
    this.dataValue = value;
  }

  ngAfterViewInit() {
    console.log('init');
  }

  constructor(public filterService: FilterService) {}
}

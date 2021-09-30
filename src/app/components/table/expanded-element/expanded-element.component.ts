import { trigger } from '@angular/animations';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { timer } from 'rxjs';

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
        enter: {
          startX: '0px',
          startY: '-200px',
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
export class ExpandedElementComponent<T extends BeersSearchResult> implements AfterViewInit {
  private dataValue: T;
  @Input() get data(): T {
    return this.dataValue;
  }
  set data(value: T) {
    this.dataValue = value;
  }
  ngAfterViewInit() {
    timer(1000)
      .toPromise()
      .then(() => this.renderer.removeClass(this.element.nativeElement, 'animate-in'));
    this.renderer.addClass(this.element.nativeElement, 'animate-in');
  }
  constructor(
    public filterService: FilterService,
    private element: ElementRef,
    private renderer: Renderer2
  ) {}
}

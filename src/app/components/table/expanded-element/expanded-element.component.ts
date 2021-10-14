import { trigger } from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  Renderer2,
} from '@angular/core';

import { flyInTemplate } from '../../../animations/templates';
import { FilterService } from '../../../services/filter.service';
import { BeersSearchResult } from '../../../services/search.service';

@Component({
  selector: 'elder-expanded-element',
  templateUrl: './expanded-element.component.html',
  styleUrls: ['./expanded-element.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    this.renderer.addClass(this.elementRef.nativeElement, 'animate-in');
    setTimeout(() => this.renderer.removeClass(this.elementRef.nativeElement, 'animate-in'), 2000);
  }
  constructor(
    public filterService: FilterService,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {}
}

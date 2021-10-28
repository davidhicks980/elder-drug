import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  Renderer2,
} from '@angular/core';

import { IconNames, ICON_NAMES } from '../../injectables/icons.injectable';
import { FilterService } from '../../services/filter.service';
import { BeersSearchResult } from '../../services/search.service';

@Component({
  selector: 'elder-row-detail',
  templateUrl: './row-detail.component.html',
  styleUrls: ['./row-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowDetailComponent<T extends BeersSearchResult> implements AfterViewInit {
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
    private elementRef: ElementRef,
    @Inject(ICON_NAMES) public iconNames: IconNames
  ) {}
}

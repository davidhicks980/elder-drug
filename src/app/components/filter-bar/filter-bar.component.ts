import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { Subject } from 'rxjs';
import { destroy } from '../../functions/destroy';

import { ElementMediaQuery, ResizerService } from '../../services/resizer.service';

@Component({
  selector: 'elder-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterBarComponent implements OnDestroy {
  destroy$ = new Subject();
  elementCollapseQuery: ElementMediaQuery;
  ngOnDestroy() {
    this.destroy$.next(true);
  }
  constructor(
    public element: ElementRef,
    private renderer: Renderer2,
    private resizer: ResizerService
  ) {
    this.elementCollapseQuery = this.resizer.observeBreakpoint(this.element.nativeElement, 600);
    this.elementCollapseQuery.belowBreakpoint$
      .pipe(destroy(this))
      .subscribe((collapsed) => {
        collapsed
          ? this.renderer.addClass(this.element.nativeElement, 'collapsed')
          : this.renderer.removeClass(this.element.nativeElement, 'collapsed');
      })
      .add(() => this.elementCollapseQuery.removeObserver);
  }
}

import { ChangeDetectionStrategy, Component, ElementRef, Renderer2, ViewEncapsulation } from '@angular/core';

import { LayoutService } from '../../../services/layout.service';

@Component({
  selector: 'elder-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterBarComponent {
  constructor(
    layoutService: LayoutService,
    public element: ElementRef,
    private renderer: Renderer2
  ) {
    let resizeObserver = new ResizeObserver((entry: ResizeObserverEntry[]) => {
      entry[0].contentRect.width < 500
        ? this.renderer.addClass(this.element.nativeElement, 'collapsed')
        : this.renderer.removeClass(this.element.nativeElement, 'collapsed');
    });
    resizeObserver.observe(this.element.nativeElement);
  }
}

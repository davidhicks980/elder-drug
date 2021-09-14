import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  HostBinding,
  Inject,
  Output,
  QueryList,
  TemplateRef,
} from '@angular/core';
import { from, merge, Observable, of, timer } from 'rxjs';
import { filter, map, switchMapTo } from 'rxjs/operators';

import { TemplateContentDirective } from '../../../directives/content-template.directive';
import { SIDEBAR_TOKEN, SidebarTokens, sidebarTokens } from './SidebarTokens';

@Component({
  selector: 'elder-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'sidebar' },
  providers: [{ provide: SIDEBAR_TOKEN, useValue: sidebarTokens }],
})
export class SidebarComponent implements AfterViewInit, AfterContentInit {
  @HostBinding('class.is-searching') searching: boolean = false;
  @Output('searching') searchEmitter: EventEmitter<boolean> =
    new EventEmitter();
  @ContentChildren(TemplateContentDirective)
  templates: QueryList<TemplateContentDirective>;
  isSearching$: Observable<boolean> = of(false);
  templateRefs = { brand: null, toggle: null };
  brandTemplate$: Observable<TemplateRef<unknown>>;
  toggleTemplate$: Observable<TemplateRef<unknown>>;

  setSearchingStatus(searching: boolean) {
    this.searching = searching;
  }
  ngAfterViewInit() {
    timer(0)
      .toPromise()
      .then(() => {
        this.cdr.markForCheck();
      });
  }
  ngAfterContentInit() {
    this.brandTemplate$ = this.filterTemplates(this.tokens.BRAND_TEMPLATE);
    this.toggleTemplate$ = this.filterTemplates(this.tokens.TOGGLE_TEMPLATE);
  }
  constructor(
    @Inject(SIDEBAR_TOKEN) private tokens: SidebarTokens,
    private cdr: ChangeDetectorRef
  ) {}

  filterTemplates(contentId: Symbol) {
    const templateChange$ = merge(
      from(this.templates.toArray()),
      this.templates.changes.pipe(switchMapTo(from(this.templates.toArray())))
    );
    return templateChange$.pipe(
      filter((template) => template.templateContent === contentId),
      map((template) => {
        console.log(template.templateRef.elementRef.nativeElement);
        return template.templateRef;
      })
    );
  }
}

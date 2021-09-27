import { AnimationEvent } from '@angular/animations';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { BehaviorSubject, merge, Observable, of } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { DataService } from '../../services/data.service';
import { ResizeService } from '../../services/resize.service';
import { SearchService } from '../../services/search.service';
import { TableService } from '../../services/table.service';
import { TableComponent } from '../table/table.component';
import { layoutAnimations } from './layout.animations';
import { scrollDirectionCb } from './scroll-direction.function';

export enum ScrollDirection {
  UP,
  DOWN,
}
@Component({
  selector: 'elder-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  providers: [DataService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    layoutAnimations.enterLeaveShift('MobileSidebarShift', '-700px'),
    layoutAnimations.enterLeaveShift('MobileContentShift', '700px'),
    layoutAnimations.statefulSidebarShift('FullSidebarShift', 260),
    layoutAnimations.statefulSidebarShift('TabsSidebarShift', 260),
  ],
})
export class LayoutComponent {
  @ViewChild('toggleTemplate') toggleTemplate: TemplateRef<HTMLElement>;
  togglePortalContent!: TemplatePortal;
  @ViewChild('layout') mainWrapper: ElementRef<HTMLDivElement>;
  @ViewChildren('mainWrapper') main: QueryList<ElementRef<HTMLElement>>;

  @ViewChild(TableComponent) table: TableComponent;
  private scrollDirectionSource: BehaviorSubject<ScrollDirection> = new BehaviorSubject(
    ScrollDirection.DOWN
  );
  scrollDirection$ = this.scrollDirectionSource
    .asObservable()
    .pipe(map((direction) => direction === ScrollDirection.DOWN));
  private animationSource = new BehaviorSubject({
    toggle: false,
    sidebar: false,
    content: false,
    tabs: false,
  });
  animating$ = this.animationSource.asObservable();
  mobile$: Observable<boolean>;
  sidebarOpen$: Observable<boolean>;

  toggleSidenav() {
    this.size.toggleSidenav();
  }
  getTogglePortal(condition: boolean) {
    if (condition) {
      return this.togglePortalContent;
    }
  }
  getContentAnimationState({ mobile, sidebarOpen }) {
    if (!mobile) {
      return sidebarOpen ? 'open' : 'close';
    }
  }
  changeToggleState(toggle: boolean) {
    requestAnimationFrame(() => {
      this.animationSource.next({
        toggle,
        sidebar: this.animationSource.value.sidebar,
        content: this.animationSource.value.content,
        tabs: this.animationSource.value.tabs,
      });
    });
  }
  changeAnimationState({ phaseName }: AnimationEvent, id: string) {
    this.animationSource.next(
      Object.assign({}, this.animationSource.value, {
        [id]: phaseName === 'start',
      })
    );
  }

  loadDemo() {
    this.searchService.searchDrugs('loperamide');
    requestAnimationFrame(() => {
      this.tableService.emitTableFilter({ column: '*', term: 'loperamide' });
      // this.table.model.updateGroups(['SearchTerms']);
    });
  }
  ngAfterViewInit() {
    this.togglePortalContent = new TemplatePortal(this.toggleTemplate, this.containerRef);

    let options = { root: null, threshold: null };
    options.root = document;
    options.threshold = [0.4, 0.5, 0.6, 0.7, 0.8, 0.99];
    const observer = new IntersectionObserver(
      scrollDirectionCb(this.scrollDirectionSource),
      options
    );
    this.main.changes
      .pipe(
        filter(() => !!this.main.first),
        take(1)
      )
      .subscribe(() => {
        observer.observe(this.main.first.nativeElement);
      });
  }

  get selectedTable$() {
    return this.tableService.selection$;
  }

  constructor(
    public tableService: TableService,
    private searchService: SearchService,
    public size: ResizeService,
    private containerRef: ViewContainerRef
  ) {
    this.sidebarOpen$ = this.size.sidenavObserver;
    this.mobile$ = merge(this.size.mobile$, of(window.innerWidth < 600)) as Observable<boolean>;
  }
}

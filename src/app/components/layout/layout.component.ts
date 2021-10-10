import { AnimationEvent } from '@angular/animations';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { BehaviorSubject, Subject, timer } from 'rxjs';
import { debounce } from 'rxjs/operators';

import { DataService } from '../../services/data.service';
import { destroy } from '../../services/destroy';
import { LayoutService } from '../../services/layout.service';
import { SearchService } from '../../services/search.service';
import { TableService } from '../../services/table.service';
import { layoutAnimations } from './layout.animations';

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
export class LayoutComponent implements AfterViewInit, OnDestroy {
  @ViewChild('toggleTemplate') toggleTemplate: TemplateRef<HTMLElement>;
  togglePortalContent!: TemplatePortal;
  @ViewChildren('watchScroll') scrollMarker: QueryList<ElementRef<HTMLElement>>;
  debounceTabRounding: number = 0;
  private roundTabsSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
  roundTabs$ = this.roundTabsSource
    .asObservable()
    .pipe(debounce(() => timer(this.debounceTabRounding)));
  sidebarAnimatingSource = new BehaviorSubject(false);
  observer: IntersectionObserver;
  destroy$ = new Subject();
  toggleSidenav() {
    this.layoutService.toggleSidenav();
  }
  getTogglePortal(condition: boolean) {
    if (condition) {
      return this.togglePortalContent;
    }
  }
  getContentAnimationState({ mobile, sidebar }) {
    if (!mobile) {
      return sidebar.open ? 'open' : 'close';
    }
  }

  changeAnimationState({ phaseName }: AnimationEvent) {
    this.sidebarAnimatingSource.next(phaseName === 'start');
  }

  loadDemo() {
    this.searchService.storeHistory([
      'Alprazolam',
      'Morphine',
      'Loperamide',
      'Alcortin',
      'Aller-Flo',
      'Dofetilide',
      'Warfarin',
      'Aldactone',
      'Sertraline',
      'Ambien',
    ]);
    this.searchService.searchDrugs();
  }
  ngOnDestroy() {
    this.observer.disconnect();
    this.destroy$.next(false);
  }
  ngAfterViewInit() {
    this.togglePortalContent = new TemplatePortal(this.toggleTemplate, this.containerRef);
    this.scrollMarker.changes
      .pipe(destroy(this))
      .subscribe(this.setupTabIntersectionObserver.bind(this));
    this.scrollMarker.notifyOnChanges();
    this.layoutService.openSidenav$.subscribe((open) => {
      if (this.layoutService.isMobile && !open) {
        this.debounceTabRounding = 0;
        this.roundTabsSource.next(false);
      }
    });
  }

  constructor(
    public tableService: TableService,
    private searchService: SearchService,
    public layoutService: LayoutService,
    private containerRef: ViewContainerRef
  ) {}

  private setupTabIntersectionObserver({ first }: QueryList<ElementRef<HTMLDivElement>>) {
    if (!this.observer) {
      const options = { threshold: [0], rootMargin: '-80px 0px 0px 0px' };
      this.observer = new IntersectionObserver((e: IntersectionObserverEntry[]) => {
        this.debounceTabRounding = this.roundTabsSource.value ? 4000 : 0;
        this.roundTabsSource.next(!e[0].isIntersecting);
      }, options);
    }
    if (first?.nativeElement) {
      this.observer.observe(first.nativeElement);
    }
  }
}

import { animate, AnimationBuilder, AnimationEvent, keyframes, style } from '@angular/animations';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  QueryList,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { debounce, map, mapTo, take, throwIfEmpty } from 'rxjs/operators';

import { DataService } from '../../services/data.service';
import { destroy } from '../../services/destroy';
import { LayoutService } from '../../services/layout.service';
import { SearchService } from '../../services/search.service';
import { TableService } from '../../services/table.service';
import { TableCardComponent } from '../table/table-card/table-card.component';

export enum ScrollDirection {
  UP,
  DOWN,
}
export enum SidebarState {
  OPENED,
  OPENING,
  CLOSED,
  CLOSING,
}

@Component({
  selector: 'elder-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  providers: [DataService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements AfterViewInit, OnDestroy {
  @ViewChild('toggleTemplate') toggleTemplate: TemplateRef<HTMLElement>;
  togglePortalContent!: TemplatePortal;
  @ViewChild(TableCardComponent, { read: ElementRef }) tableCard: ElementRef<HTMLElement>;
  @ViewChildren('watchScroll') scrollMarker: QueryList<ElementRef<HTMLElement>>;
  debounceTabRounding: number = 0;
  @HostBinding('style.--shift-duration')
  @Input()
  shiftAnimationDuration = '400ms';
  @HostBinding('class.opened')
  get isOpened() {
    return this.sidebarState === SidebarState.OPENED;
  }
  @HostBinding('class.opening')
  get isOpening() {
    return this.sidebarState === SidebarState.OPENING;
  }
  @HostBinding('class.closed')
  get isClosed() {
    return this.sidebarState === SidebarState.CLOSED;
  }
  @HostBinding('class.closing')
  get isClosing() {
    return this.sidebarState === SidebarState.CLOSING;
  }
  private sidebarStateSource: BehaviorSubject<SidebarState> = new BehaviorSubject(
    SidebarState.OPENING
  );
  sidebarState$ = this.sidebarStateSource.asObservable().pipe(
    map((state) => ({
      opened: state === SidebarState.OPENED,
      opening: state === SidebarState.OPENING,
      closed: state === SidebarState.CLOSED,
      closing: state === SidebarState.CLOSING,
    }))
  );

  private roundTabsSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
  roundTabs$ = this.roundTabsSource
    .asObservable()
    .pipe(debounce(() => timer(this.debounceTabRounding)));
  tabIntersectionObserver: IntersectionObserver;
  destroy$ = new Subject();
  searchStarted$: Observable<boolean>;

  get sidebarState() {
    return this.sidebarStateSource.getValue();
  }

  private getTableCardShrinkFactor() {
    if (this.element.nativeElement && this.tableCard?.nativeElement) {
      let { scrollWidth } = this.element.nativeElement as HTMLElement;
      return (scrollWidth - 260) / scrollWidth;
    } else {
      return 1;
    }
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
    this.tabIntersectionObserver.disconnect();
    this.destroy$.next(false);
  }
  get animationDuration() {
    return Number(this.shiftAnimationDuration.match(/[(\d)]+/)[0]);
  }
  private animateTableCardShrink() {
    let setStyle = this.renderer.setStyle.bind(this.renderer);
    let scale = this.getTableCardShrinkFactor(),
      { nativeElement } = this.tableCard;
    setStyle(nativeElement, `transform`, `scaleX(${scale})`);
    setStyle(nativeElement, 'transition', 'transform 400ms ease-in-out', 2);
    setTimeout(() => {
      nativeElement.offsetHeight;
      setStyle(nativeElement, 'transition', 'none', 2);
      setStyle(nativeElement, 'transform', 'scaleX(1)', 2);
    }, this.animationDuration);
  }

  ngAfterViewInit() {
    this.togglePortalContent = new TemplatePortal(this.toggleTemplate, this.containerRef);
    this.scrollMarker.changes
      .pipe(destroy(this))
      .subscribe(this.setupTabIntersectionObserver.bind(this));
    this.scrollMarker.notifyOnChanges();
    this.roundTabs$.subscribe(console.log);
    this.layoutService.openSidenav$.subscribe((open) => {
      let { isMobile } = this.layoutService;
      this.shiftAnimationDuration = this.layoutService.isMobile ? '200ms' : '400ms';
      let [transitionState, endState] = open
        ? [SidebarState.OPENING, SidebarState.OPENED]
        : [SidebarState.CLOSING, SidebarState.CLOSED];
      this.sidebarStateSource.next(transitionState);

      setTimeout(() => {
        this.sidebarStateSource.next(endState);
      }, this.animationDuration);
      if (open && !isMobile && this.tableCard) {
        this.animateTableCardShrink();
      }
    });
  }

  constructor(
    public tableService: TableService,
    private searchService: SearchService,
    public layoutService: LayoutService,
    private containerRef: ViewContainerRef,
    private element: ElementRef,
    private renderer: Renderer2
  ) {
    this.searchStarted$ = this.tableService.tableOptions$.pipe(take(1), mapTo(true));
    this.shiftAnimationDuration = this.layoutService.isMobile ? '200ms' : '400ms';
  }

  private setupTabIntersectionObserver({ first }: QueryList<ElementRef<HTMLDivElement>>) {
    if (!this.tabIntersectionObserver) {
      const options = { threshold: [0], rootMargin: '-50px 0px 0px 0px' };
      const tabsVisible = () => !(this.layoutService.isDrawerOpen && this.layoutService.isMobile);
      this.tabIntersectionObserver = new IntersectionObserver((e: IntersectionObserverEntry[]) => {
        this.debounceTabRounding = this.roundTabsSource.value ? 10000 : 0;
        if (tabsVisible()) {
          this.roundTabsSource.next(!e[0].isIntersecting);
        }
      }, options);
    }
    if (first?.nativeElement) {
      this.tabIntersectionObserver.observe(first.nativeElement);
    }
  }
}

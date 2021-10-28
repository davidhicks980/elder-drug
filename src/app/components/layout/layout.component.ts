import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  QueryList,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { debounce, mapTo, pluck, switchMap, take, takeUntil } from 'rxjs/operators';

import { DataService } from '../../services/data.service';
import { destroy } from '../../functions/destroy';
import { LayoutService, SearchDrawerState } from '../../services/layout.service';
import { SearchService } from '../../services/search.service';
import { TableService } from '../../services/table.service';
import { TableContainerComponent as TableContainerComponent } from '../table/table-container.component';
import { AboutComponent, DisclaimerComponent } from '../toolbar/toolbar.component';

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
})
export class LayoutComponent implements AfterViewInit, OnDestroy {
  @ViewChild('toggleTemplate') toggleTemplate: TemplateRef<HTMLElement>;
  togglePortalContent!: TemplatePortal;
  @ViewChild(TableContainerComponent, { read: ElementRef }) tableCard: ElementRef<HTMLElement>;
  @ViewChildren('watchScroll') scrollMarker: QueryList<ElementRef<HTMLElement>>;
  debounceTabRounding: number = 0;
  @HostListener('animationend', ['$event'])
  handleAnimationEnd($event: AnimationEventInit) {
    if (
      $event.animationName === 'ShiftSidebarIn' ||
      $event.animationName === 'ShiftSidebarOut' ||
      $event.animationName === 'MobileSlideIn'
    ) {
      this.layout.completeSearchDrawerAnimation();
    }
  }

  private roundTabsSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
  roundTabs$ = this.roundTabsSource
    .asObservable()
    .pipe(debounce(() => timer(this.debounceTabRounding)));
  private tabIntersect$: IntersectionObserver;
  destroy$ = new Subject();
  searchStarted$: Observable<boolean>;
  private tableShrinkAnimation: Animation;

  // Nav drawer can only be used when on mobile.
  // If user switches from mobile=>desktop=>mobile, close the nav drawer
  private navigationDrawerSource = new BehaviorSubject(false);
  navigationDrawer$ = this.layout.mobile$.pipe(
    switchMap((mobile) => {
      if (!mobile) {
        this.navigationDrawerSource.next(false);
      }
      return this.navigationDrawerSource.asObservable();
    })
  );
  toggleNavigationDrawer(force: boolean) {
    this.navigationDrawerSource.next(
      typeof force === 'boolean' ? force : !this.navigationDrawerSource.value
    );
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
    this.searchService.searchTerms();
  }
  ngOnDestroy() {
    this.tabIntersect$.disconnect();
    this.destroy$.next(false);
  }
  get shiftDuration() {
    return this.layout.isMobile
      ? this.layout.mobileSearchDrawerShiftDuration
      : this.layout.searchDrawerShiftDuration;
  }

  private buildTableShrinkAnimation(): Animation {
    this.tableShrinkAnimation?.cancel();
    let { offsetWidth } = this.host.nativeElement;
    let scale = (offsetWidth - 260) / offsetWidth,
      { nativeElement } = this.tableCard;
    let keyframes = new KeyframeEffect(
      nativeElement,
      [{ transform: 'scaleX(1)' }, { transform: `scaleX(${scale})` }],
      { duration: this.shiftDuration, easing: 'cubic-bezier(0.5, 0.15, 0.225, 1)' }
    );
    return new Animation(keyframes, document.timeline);
  }
  openDisclaimerDialog() {
    this.dialog.open(DisclaimerComponent, { width: '500px' });
  }
  openAboutDialog() {
    this.dialog.open(AboutComponent, { width: '500px' });
  }
  openErrorDialog() {
    this.dialog.open(ErrorComponent, { width: '500px' });
  }
  openSearch() {
    this.layout.toggleSidenav(true, true);
  }
  ngAfterViewInit() {
    this.togglePortalContent = new TemplatePortal(this.toggleTemplate, this.container);
    this.scrollMarker.changes.pipe(destroy(this)).subscribe(this.setupTabIntersect$.bind(this));
    this.scrollMarker.notifyOnChanges();
    this.layout.searchDrawerState$
      .pipe(destroy(this), pluck(SearchDrawerState.OPENING))
      .subscribe(this.animateSearchDrawer.bind(this));
  }

  animateSearchDrawer(open) {
    let { isMobile } = this.layout;
    let { nativeElement } = this.host;
    this.renderer.setStyle(nativeElement, '--shift-duration', this.shiftDuration + 'ms', 2);
    if (open && !isMobile && this.tableCard) {
      this.tableShrinkAnimation?.finish();
      if (this.tableShrinkAnimation?.currentTime != this.shiftDuration) {
        this.tableShrinkAnimation = this.buildTableShrinkAnimation();
        this.tableShrinkAnimation.onfinish = () => {
          setTimeout(() => {
            this.renderer.setStyle(this.tableCard.nativeElement, '--table-card--opacity', '1', 2);
          }, 75);
        };
      }
      this.renderer.setStyle(this.tableCard.nativeElement, '--table-card--opacity', '0', 2);
      this.tableShrinkAnimation.play();
    }
  }
  constructor(
    public tableService: TableService,
    public searchService: SearchService,
    public layout: LayoutService,
    public dataService: DataService,
    private container: ViewContainerRef,
    private host: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    public dialog: MatDialog
  ) {
    this.searchStarted$ = this.tableService.tableOptions$.pipe(take(1), mapTo(true));
    this.dataService.error$.pipe(destroy(this), takeUntil(this.searchStarted$)).subscribe(() => {
      this.dialog.open(ErrorComponent, { width: '500px' });
    });
    this.layout.searchDrawerState$.pipe(destroy(this)).subscribe((state) => {
      let { nativeElement } = this.host;
      Object.entries(state).map(([state, active]) => {
        this.renderer[active ? 'addClass' : 'removeClass'](nativeElement, state);
      });
    });
  }

  private setupTabIntersect$({ first }: QueryList<ElementRef<HTMLDivElement>>) {
    if (!this.tabIntersect$) {
      const options = { threshold: [0], rootMargin: '-95px 0px 0px 0px' };
      const tabsVisible = () => !(this.layout.isSidenavOpen && this.layout.isMobile);
      this.tabIntersect$ = new IntersectionObserver((e: IntersectionObserverEntry[]) => {
        this.debounceTabRounding = this.roundTabsSource.value ? 2000 : 0;
        if (tabsVisible()) {
          this.roundTabsSource.next(!e[0].isIntersecting);
        }
      }, options);
    }
    if (first?.nativeElement) {
      this.tabIntersect$.observe(first.nativeElement);
    }
  }
}
@Component({
  selector: 'elder-error',
  template: `
    <h2 mat-dialog-title>Error</h2>
    <div mat-dialog-content>
      <p>
        We're having trouble connecting to Elder Drug's database. If your internet is working
        properly, try <a style="color: var(--primary-1)" href="elderdrug.com">refreshing</a> the
        page. Otherwise, email me at david@davidhicks.dev and I'll see if I can find the problem.
      </p>
    </div>
  `,
})
export class ErrorComponent {}

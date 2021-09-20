import { AnimationEvent } from '@angular/animations';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { BehaviorSubject, merge, Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService } from '../../services/data.service';
import { ResizeService } from '../../services/resize.service';
import { TableService } from '../../services/table.service';
import { layoutAnimations } from './layout.animations';
import { scrollDirectionCb } from './scroll-direction.function';
import { SIDEBAR_TOKEN, SidebarTokens, sidebarTokens } from './side-navigation/SidebarTokens';
import { TOOLBAR_TOKENS, ToolbarTokens, toolbarTokens } from './top-toolbar/ToolbarTokens';

export enum ScrollDirection {
  UP,
  DOWN,
}
@Component({
  selector: 'elder-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  providers: [
    DataService,
    { provide: SIDEBAR_TOKEN, useValue: sidebarTokens },
    { provide: TOOLBAR_TOKENS, useValue: toolbarTokens },
  ],

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
  @ViewChild('mainWrapper') main: ElementRef<HTMLElement>;
  loaded: boolean = false;

  private scrollDirectionSource: Subject<ScrollDirection> = new Subject();
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

  ngAfterViewInit() {
    this.togglePortalContent = new TemplatePortal(
      this.toggleTemplate,
      this.containerRef
    );

    let options = { root: null, threshold: null },
      main = this.main.nativeElement;
    options.root = document;
    options.threshold = [0.4, 0.5, 0.6, 0.7, 0.8, 0.99];
    const observer = new IntersectionObserver(
      scrollDirectionCb(this.scrollDirectionSource),
      options
    );
    observer.observe(main);
  }
  get tokens() {
    return {
      sidebar: {
        brand: this.sidebarTokens.BRAND_TEMPLATE,
        toggle: this.sidebarTokens.TOGGLE_TEMPLATE,
      },
      toolbar: { toggle: this.toolbarTokens.TOGGLE_TEMPLATE },
    };
  }
  get selectedTable$() {
    return this.tableService.selection$;
  }

  constructor(
    public size: ResizeService,
    public tableService: TableService,
    private containerRef: ViewContainerRef,
    @Inject(SIDEBAR_TOKEN) private sidebarTokens: SidebarTokens,
    @Inject(TOOLBAR_TOKENS) private toolbarTokens: ToolbarTokens
  ) {
    this.sidebarOpen$ = this.size.sidenavObserver;
    this.mobile$ = merge(
      this.size.mobileObserver,
      of(window.innerWidth < 600)
    ) as Observable<boolean>;
  }
}

"use strict";
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
exports.__esModule = true;
exports.LayoutComponent = void 0;
var animations_1 = require("@angular/animations");
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var animations_2 = require("../../animations");
var firebase_service_1 = require("../../services/firebase.service");
var LayoutComponent = /** @class */ (function () {
  function LayoutComponent(webSocketService, state, columnService, nav) {
    var _this = this;
    this.webSocketService = webSocketService;
    this.state = state;
    this.columnService = columnService;
    this.nav = nav;
    this.layout = this.state.layoutStatus;
    this.sidenavOpen = true;
    this.enabledTables = new rxjs_1.Subject();
    this.showTabs = false;
    this.tables = [];
    this.loaded = false;
    this.state.windowWidth$.subscribe(function (layoutStatus) {
      _this.layout = layoutStatus;
      _this.mobileWidth = _this.layout.mobileWidth;
      _this.sidenavOpen = _this.layout.sidenavOpen;
      _this.showTabs = nav.showTabs;
    });
  }
  LayoutComponent.prototype.gradient = function (e) {
    console.log(e);
  };
  LayoutComponent = __decorate(
    [
      core_1.Component({
        selector: "elder-layout",
        templateUrl: "./layout.component.html",
        styleUrls: ["./layout.component.scss"],
        providers: [firebase_service_1.FirebaseService],
        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        animations: [
          animations_2.slideInLeft,
          animations_2.dropInAnimation,
          animations_2.tableVisibleAnimation,
          animations_2.mobileSlidingSidenavAnimation,
          animations_2.logoSlideAnimation,
          animations_2.slidingContentAnimation,
          animations_1.trigger("arrowSlideLeft", [
            animations_1.transition(":enter", [
              animations_1.style({
                opacity: 0,
                transform: "translateX(200px)",
              }),
              animations_1.animate(
                "300ms ease",
                animations_1.style({ opacity: 1, transform: "translate(0px)" })
              ),
            ]),
          ]),
          animations_1.trigger("sidenavExpand", [
            animations_1.state(
              "close",
              animations_1.style({ transform: "translateX(0px)" })
            ),
            animations_1.state(
              "open",
              animations_1.style({ transform: "translateX(0px)" })
            ),
            animations_1.state(
              "mobileClose",
              animations_1.style({ transform: "translateX(0px)" })
            ),
            animations_1.state(
              "mobileOpen",
              animations_1.style({ transform: "translateX(0px)" })
            ),
            animations_1.transition(
              "mobileOpen => mobileClose",
              animations_1.group([
                animations_1.animate(
                  "200ms ease",
                  animations_1.keyframes([
                    animations_1.style({
                      transform: "translateX(-500px)",
                      offset: 1,
                    }),
                  ])
                ),
              ])
            ),
            animations_1.transition(
              "mobileClose => mobileOpen",
              animations_1.animate(
                "400ms ease",
                animations_1.keyframes([
                  animations_1.style({
                    transform: "translateX(-500px)",
                    offset: 0,
                  }),
                  animations_1.style({
                    transform: "translateX(0px)",
                    offset: 1,
                  }),
                ])
              )
            ),
            animations_1.transition(
              "open => close",
              animations_1.group([
                animations_1.animate(
                  "200ms ease",
                  animations_1.keyframes([
                    animations_1.style({
                      transform: "translateX(-260px)",
                      offset: 1,
                    }),
                  ])
                ),
              ])
            ),
            animations_1.transition(
              "close => open",
              animations_1.animate(
                "400ms ease",
                animations_1.keyframes([
                  animations_1.style({
                    transform: "translateX(-260px)",
                    offset: 0,
                  }),
                  animations_1.style({
                    transform: "translateX(0px)",
                    offset: 1,
                  }),
                ])
              )
            ),
            animations_1.transition(":enter", [
              animations_1.style({
                transform: "translateX(-260px)",
              }),
              animations_1.animate(
                "400ms ease",
                animations_1.style({ transform: "translate(0px)" })
              ),
            ]),
            animations_1.transition(":leave", [
              animations_1.style({
                transform: "translateX(0px)",
              }),
              animations_1.animate(
                "200ms ease",
                animations_1.style({
                  transform: "translateX(-260px)",
                })
              ),
            ]),
          ]),
        ],
      }),
    ],
    LayoutComponent
  );
  return LayoutComponent;
})();
exports.LayoutComponent = LayoutComponent;
/*
@Component({
  selector: 'elder-tab',
  template: `
    <nav [style.width]="width" class="nav-header">
      <ul *ngIf="loaded" class="button-row-style">
        <ng-container *ngFor="let tab of shownTabs | async; index as index">
          <li
            [class.active]="index === currentTab"
            [class.inactive]="index != currentTab"
            (click)="handleTabClick(index)"
            class="tab-button"
            [class.collapse]="index != 0"
          >
            <a class="button grid__cell--span-8">{{ tab.ShortName }}</a>
          </li>
        </ng-container>
      </ul>
      <div role="menu" aria-haspopup="true" class="has-dropdown" tabindex="0">
        <button class="nav-button">
          <mat-icon
            class="overflow-menu-button"
            svgIcon="overflow_menu_vertical"
          ></mat-icon>
        </button>
        <ol role="menubar" aria-hidden="false" class="nav-menu dropdown">
          <span
            *ngFor="let tab of hiddenTabs | async"
            data-title="nav-title"
            class="tooltip"
            ><li class="active">
              <button tabindex="0" role="menuitem" class="menu-item">
                <span class="ellipsis">howdy</span>
              </button>
            </li>
          </span>
        </ol>
      </div>
    </nav>
  `,
  styleUrls: ['./tab.component.scss'],
  providers: [FirebaseService],
})
export class TabComponent implements AfterViewInit {
  @ViewChildren('li') thing: QueryList<any>;
  @ViewChild('.nav') nav: ElementRef;
  @Input() tabs: Table[];
  enabledTables: any;
  currentTab: number;
  isHidden: boolean = true;
  length: any;
  breakpoints = new Map();
  io: IntersectionObserver;
  lowestBreakpoint: number = 5;
  coveredWidth: number;
  totalWidth: number;
  itemWidth: number = 200;
  itemsHidden: any;
  itemCount: number;
  hiddenItemsListener: any = new Subject();
  hiddenItemsCount: number = 0;
  dropdownItems: Observable<unknown>;
  shownTabs: Observable<{}[]>;
  hiddenTabs: Observable<{}[]>;
  itemsInfo: Observable<any>;
  items: any;
  loaded = false;
  ngAfterViewInit() {
    this.createIntersectionObserver();
    this.loaded = true;
  }
  get width() {
    return this.itemCount * 200 + 'px';
  }
  createIntersectionObserver() {
    let options = {
      root: null,
      rootMargin: '0px',
      threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    };
    this.io = new IntersectionObserver((entries) => {
      for (let entry of entries) {
        this.coveredWidth = entry.intersectionRect.right;
        this.hiddenItemsCount = Math.floor(
          (this.totalWidth - this.coveredWidth) / this.itemWidth
        );
        Math.sign(this.hiddenItemsCount) != -1
          ? this.hiddenItemsListener.next(this.hiddenItemsCount + 1)
          : this.hiddenItemsListener.next(0);
      }
    }, options);
    this.io.observe(document.querySelector('nav'));
  }

  handleTabClick(e) {
    console.log(e);
    this.currentTab = e;
  }
  constructor(
    private columnService: ColumnService,
    private tableService: TableService,
    private re: Renderer2
  ) {
    this.enabledTables = combineLatest([
      this.hiddenItemsListener,
      this.tableService.tableStatus$,
    ]).pipe(
      map(([hiddenCount, items]) => {
        return {
          hidden: items.slice(-(hiddenCount as number) - 1, -1),
          shown: items.slice(0, items.length - (hiddenCount as number)),
        };
      })
    );
    this.items = this.tableService.tableStatus$
      .pipe(
        tap((items: any[]) => {
          this.itemCount = items.length;
          this.totalWidth = this.itemCount * this.itemWidth;
        })
      )
      .subscribe(() => {});
    this.shownTabs = this.enabledTables.pipe(pluck('shown')) as Observable<
      Table[]
    >;
    this.hiddenTabs = this.enabledTables.pipe(
      pluck('hidden'),
      tap((item) => console.log(item))
    ) as Observable<Table[]>;

    this.currentTab = 0;
  }
}*/

import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { merge, Observable, of, Subject } from 'rxjs';

import {
  dropInAnimation,
  logoSlideAnimation,
  mobileSlidingSidenavAnimation,
  slideInLeft,
  slidingContentAnimation,
  tableVisibleAnimation,
} from '../../animations';
import { DataService } from '../../services/data.service';
import { NavigationService } from '../../services/navigation.service';
import { ResizeService } from '../../services/resize.service';
import { Table, TableService } from '../../services/table.service';

@Component({
  selector: 'elder-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  providers: [DataService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    slideInLeft,
    dropInAnimation,
    tableVisibleAnimation,
    mobileSlidingSidenavAnimation,
    logoSlideAnimation,
    slidingContentAnimation,

    trigger('sidenavExpand', [

      transition(':enter', [
        style({
          transform: 'translateX(-100%)',
        }),
        animate('400ms ease', style({ transform: 'translate(0px)' })),
      ]),
      transition(':leave', [
        style({
          transform: 'translateX(0px)',
        }),
        animate(
          '200ms ease',
          style({
            transform: 'translateX(-100%)',
          })
        ),
      ]),
    ]),
  ],
})
export class LayoutComponent {
  tables: Table[] = [];
  enabledTables: Observable<Table[]> = new Subject();
  selectedTable: string = '';
  tableDescription: string = '';
  loaded: boolean = false;
  currentPage: number = 0;
  mobile$: Observable<boolean>;
  sidebarOpen$: Observable<boolean>;
  initiallyMobile$: Observable<boolean>;
  ngAfterViewInit() {
    this.mobile$.subscribe(console.log);
  }
  constructor(
    public size: ResizeService,
    public nav: NavigationService,
    public tableService: TableService
  ) {
    this.sidebarOpen$ = this.size.sidenavObserver;
    this.initiallyMobile$ = of(window.innerWidth < 600);
    this.mobile$ = merge(
      this.size.mobileObserver,
      this.initiallyMobile$
    ) as Observable<boolean>;
  }
}
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

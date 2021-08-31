import { ViewportRuler } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, pluck, tap } from 'rxjs/operators';

import { Table, TableService } from './table.service';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
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
  itemCount: number = 0;
  hiddenItemsListener: any = new Subject();
  hiddenItemsCount: number = 0;
  dropdownItems: Observable<unknown>;
  itemsInfo: Observable<any>;
  tableProvider: Observable<{ hidden: any[]; shown: any[] }>;
  private _showTabs: BehaviorSubject<boolean> = new BehaviorSubject(true);
  get showTabs() {
    return this._showTabs.value;
  }
  get shownTabs() {
    return this.tableProvider.pipe(pluck('shown')) as Observable<Table[]>;
  }
  get allTabs() {
    return this.tableProvider.pipe(pluck('all'));
  }
  get width() {
    return this.itemCount * 200 + 'px';
  }
  createIntersectionObserver(elementRef) {
    let options = {
      root: null,
      rootMargin: '0px',
      threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    };
    let observerFunction = (entries) => {
      for (let entry of entries) {
        this.coveredWidth = entry.intersectionRect.right;
        this.hiddenItemsCount = Math.floor(
          (this.itemCount * 200 - this.coveredWidth) / 200
        );
        Math.sign(this.hiddenItemsCount) != -1
          ? this.hiddenItemsListener.next(this.hiddenItemsCount + 1)
          : this.hiddenItemsListener.next(0);
      }
    };
    const observer = new IntersectionObserver(observerFunction, options);
    observer.observe(elementRef);
  }
  get hiddenTabs() {
    return this.tableProvider.pipe(
      pluck('hidden'),
      tap((item) => console.log(item))
    ) as Observable<Table[]>;
  }
  constructor(private tableService: TableService, ruler: ViewportRuler) {
    this.tableProvider = combineLatest([
      this.hiddenItemsListener,
      this.tableService.tableStatus$,
    ]).pipe(
      tap((items: any[]) => {
        this.itemCount = items.length;
        this.totalWidth = this.itemCount * this.itemWidth;
        this._showTabs.next(
          ruler.getViewportSize().width > 600 || this.itemCount === 0
        );
      }),
      map(([hiddenCount, items]) => {
        return {
          hidden: items.slice(-(hiddenCount as number) - 1, -1),
          shown: items.slice(0, items.length - (hiddenCount as number)),
          all: items,
        };
      })
    );

    this.currentTab = 0;
  }
}

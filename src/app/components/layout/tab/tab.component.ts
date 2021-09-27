import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { BehaviorSubject, interval, merge, Observable, Subject } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

import { destroy } from '../../../services/destroy';
import { TableService } from '../../../services/table.service';
import { tabAnimations } from './tab.animations';

const focusClass = 'focused';
@Component({
  selector: 'elder-tabs',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  animations: [tabAnimations.fade('fadeButtons'), tabAnimations.round('roundTab')],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabComponent implements AfterViewInit, OnDestroy {
  @Input() rounded: boolean = false;
  @Output() activeTable = new EventEmitter<number>();
  @ViewChild('list') list: ElementRef<HTMLUListElement>;
  @ViewChildren('item') items: QueryList<ElementRef<HTMLLIElement>>;
  @HostListener('mouseup')
  handleMouseUp() {
    this.scrollable = false;
  }
  intersectionObserver!: IntersectionObserver;
  currentTab$: Observable<number>;
  loaded: boolean = false;
  track: boolean = false;
  mouseOver = 0;
  first: HTMLLIElement | false = false;
  last: HTMLLIElement | false = false;
  leftOverflow: BehaviorSubject<boolean> = new BehaviorSubject(false);
  rightOverflow: BehaviorSubject<boolean> = new BehaviorSubject(false);
  scrollable: boolean = false;
  destroy$ = new Subject();
  handleTabClick(table: number) {
    this.activeTable.emit(table);
    this.tableService.emitSelectedTable(table);
  }
  handleMouseDown($event: MouseEvent, direction: 'RIGHT' | 'LEFT') {
    let left = direction === 'LEFT';
    this.scrollable = true;
    interval(10)
      .pipe(takeWhile(() => this.scrollable === true))
      .subscribe(() => {
        this.list.nativeElement.scrollBy(left ? -5 : 5, 0);
      });
    $event.preventDefault();
  }

  focusNext(item: HTMLLIElement) {
    let button = item?.nextElementSibling?.firstElementChild as HTMLButtonElement;
    if (button instanceof HTMLButtonElement) {
      button.focus();
    } else if (item?.previousElementSibling) {
      this.focusPrevious(item);
    }
  }
  focusPrevious(item: HTMLLIElement) {
    let button = item?.previousElementSibling?.firstElementChild as HTMLButtonElement;
    if (button instanceof HTMLButtonElement) {
      button.focus();
    } else if (item?.nextElementSibling) {
      this.focusNext(item);
    }
  }
  toggleChildFocusStyles(item: HTMLElement) {
    item.classList.add(focusClass);
  }

  ngOnDestroy() {
    this.intersectionObserver.disconnect();
  }
  private intersectingTabCallback(e: IntersectionObserverEntry[]) {
    let entry = e[0];
    if (this.first === entry.target) {
      this.leftOverflow.next(!entry.isIntersecting);
    }
    if (this.last === entry.target) {
      this.rightOverflow.next(!entry.isIntersecting);
    }
  }
  applyIntersectionObserver() {
    this.intersectionObserver = new IntersectionObserver(this.intersectingTabCallback.bind(this), {
      root: this.list.nativeElement,
      threshold: [1],
    });
    this.items.changes.subscribe((tabs) => {
      this.setFlankingTabs();
    });
    this.setFlankingTabs();
  }
  ngAfterViewInit() {
    this.applyIntersectionObserver();
  }
  private setFlankingTabs() {
    if (this.first) {
      this.intersectionObserver.unobserve(this.first);
    }
    if (this.last) {
      this.intersectionObserver.unobserve(this.last);
    }
    this.first = this.items.first?.nativeElement ?? false;
    this.last = this.items.last?.nativeElement ?? false;
    if (this.first instanceof HTMLElement) {
      this.intersectionObserver.observe(this.first);
    }
    if (this.last instanceof HTMLElement) {
      this.intersectionObserver.observe(this.last);
    }
  }

  constructor(public tableService: TableService, private r: Renderer2) {
    this.currentTab$ = merge(
      this.activeTable.asObservable(),
      this.tableService.selection$.pipe(map((table) => table.tableNumber))
    ).pipe(destroy(this));
  }
}

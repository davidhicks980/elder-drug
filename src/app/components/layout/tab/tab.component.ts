import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
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
  @HostBinding('class.rounded')
  @Input()
  rounded: boolean = false;
  @Output() activeTable = new EventEmitter<number>();
  @ViewChild('list') list: ElementRef<HTMLUListElement>;
  @ViewChildren('item') items: QueryList<ElementRef<HTMLLIElement>>;
  @HostListener('mouseup')
  handleMouseUp() {
    this.scrollable = false;
  }
  intersectionObserver!: IntersectionObserver;
  currentTab$: Observable<number>;
  first: HTMLLIElement | false = false;
  last: HTMLLIElement | false = false;
  leftOverflowSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
  rightOverflowSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
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
      .pipe(
        destroy(this),
        takeWhile(() => this.scrollable === true)
      )
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
    this.renderer.addClass(item, focusClass);
  }
  ngOnDestroy() {
    this.intersectionObserver.disconnect();
  }
  ngAfterViewInit() {
    this.intersectionObserver = this.createIntersectionObserver();
    this.items.changes.pipe(destroy(this)).subscribe((tabs) => {
      this.observeTabs(this.intersectionObserver);
    });
    this.observeTabs(this.intersectionObserver);
  }
  private intersectingTabCallback(entries: IntersectionObserverEntry[]) {
    for (let entry of entries) {
      if (this.first === entry.target) {
        this.leftOverflowSource.next(entry.isIntersecting === false);
      }
      if (this.last === entry.target) {
        this.rightOverflowSource.next(entry.isIntersecting === false);
      }
    }
  }
  private createIntersectionObserver() {
    return new IntersectionObserver(this.intersectingTabCallback.bind(this), {
      root: this.list.nativeElement,
      threshold: [1],
    });
  }

  private observeTabs(observer: IntersectionObserver) {
    this.first = this.items.first?.nativeElement ?? false;
    this.last = this.items.last?.nativeElement ?? false;
    if (this.first instanceof HTMLElement) {
      observer.observe(this.first);
    }
    if (this.first === this.last) return;
    if (this.last instanceof HTMLElement) {
      observer.observe(this.last);
    }
  }

  constructor(public tableService: TableService, private renderer: Renderer2) {
    this.currentTab$ = merge(
      this.activeTable.asObservable(),
      this.tableService.selection$.pipe(map((table) => table.tableNumber))
    ).pipe(destroy(this));
  }
}

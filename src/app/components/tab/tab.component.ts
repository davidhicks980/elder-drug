import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { BehaviorSubject, interval, Observable, Subject } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

import { destroy } from '../../services/destroy';
import { TableService } from '../../services/table.service';

enum TabAnimationState {
  SHIFTED,
  UNSHIFTED,
  SHIFTING,
  UNSHIFTING,
  AWAITING_UNSHIFT,
}
@Component({
  selector: 'elder-tabs',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabComponent implements AfterViewInit, OnDestroy, OnChanges {
  @HostBinding('class.rounded')
  @Input()
  rounded: boolean = false;

  @HostBinding('class.shifted')
  get shifted() {
    return this.animationState === TabAnimationState.SHIFTED;
  }
  @HostBinding('class.unshifted')
  get unshifted() {
    return this.animationState === TabAnimationState.UNSHIFTED;
  }
  @HostBinding('class.shifting')
  get shifting() {
    return this.animationState === TabAnimationState.SHIFTING;
  }
  @HostBinding('class.unshifting')
  get unshifting() {
    return this.animationState === TabAnimationState.UNSHIFTING;
  }

  @HostListener('animationend', ['$event'])
  handleAnimation($event: AnimationEvent) {
    if ($event.target instanceof HTMLLIElement) {
      this.animationState = this.rounded ? TabAnimationState.SHIFTED : TabAnimationState.UNSHIFTED;
    }
  }
  @Output() activeTable = new EventEmitter<number>();
  @ViewChild('list') list: ElementRef<HTMLUListElement>;
  @ViewChildren('item') items: QueryList<ElementRef<HTMLLIElement>>;
  @HostListener('pointerup')
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
  animationState: TabAnimationState = TabAnimationState.UNSHIFTED;
  handleTabClick(table: number) {
    this.tableService.emitTableSelection(table);
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

  focusNext(item: HTMLElement) {
    let button = item?.nextElementSibling?.firstElementChild as HTMLButtonElement;
    if (button instanceof HTMLButtonElement) {
      button.focus();
    } else if (item?.previousElementSibling) {
      (this.list.nativeElement.firstElementChild as HTMLElement).focus();
    }
  }
  focusPrevious(item: HTMLElement) {
    let button = item?.previousElementSibling?.firstElementChild as HTMLButtonElement;
    if (button instanceof HTMLButtonElement) {
      button.focus();
    } else if (item?.nextElementSibling) {
      (this.list.nativeElement.lastElementChild as HTMLElement).focus();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      typeof changes['rounded']?.previousValue === 'boolean' &&
      typeof changes['rounded']?.currentValue === 'boolean'
    ) {
      console.log(changes['rounded']);
      this.animationState = this.rounded
        ? TabAnimationState.SHIFTING
        : TabAnimationState.UNSHIFTING;
    }
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
      threshold: [0.9],
    });
  }

  private observeTabs(observer: IntersectionObserver) {
    this.first = this.items.first?.nativeElement ?? false;
    this.last = this.items.last?.nativeElement ?? false;
    if (this.first instanceof HTMLElement) {
      observer.observe(this.first);
    }
    if (this.items.length < 2) return;
    if (this.last instanceof HTMLElement) {
      observer.observe(this.last);
    }
  }

  constructor(public tableService: TableService) {
    this.currentTab$ = this.tableService.selection$.pipe(map((table) => table.tableNumber));
  }
}

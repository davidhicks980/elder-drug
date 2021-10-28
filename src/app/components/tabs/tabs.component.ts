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
import { BehaviorSubject, interval, Observable, Subject, timer } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { destroy } from '../../functions/destroy';
import { TableService } from '../../services/table.service';

enum TabAnimationState {
  SHIFTED = 'shifted',
  UNSHIFTED = 'unshifted',
  SHIFTING = 'shifting',
  UNSHIFTING = 'unshifting',
}
@Component({
  selector: 'elder-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent implements AfterViewInit, OnDestroy {
  private rounded_: boolean = false;
  @HostBinding('style.--animation-duration')
  @Input('animation-duration')
  animationDuration: number = 250;
  @HostBinding('class.rounded')
  @Input()
  get rounded(): boolean {
    return this.rounded_;
  }
  set rounded(value: boolean) {
    this.rounded_ = value;
    this.animationState = this.updateAnimationState(false);
  }

  @HostListener('animationend', ['$event'])
  handleAnimation($event: AnimationEvent) {
    if ($event.target instanceof HTMLLIElement) {
      this.finishAnimation();
    }
  }
  @Output() activeTable = new EventEmitter<number>();
  @ViewChild('list') list: ElementRef<HTMLUListElement>;
  @ViewChildren('item') items: QueryList<ElementRef<HTMLLIElement>>;
  @HostListener('pointerup')
  handleMouseUp() {
    this.scrollable = false;
  }
  private _animationState: TabAnimationState = TabAnimationState.UNSHIFTED;
  get animationState(): TabAnimationState {
    return this._animationState;
  }
  set animationState(value: TabAnimationState) {
    this.renderer.removeClass(this.element.nativeElement, this._animationState);
    this.renderer.addClass(this.element.nativeElement, value);
    this._animationState = value;
  }
  intersectionObserver!: IntersectionObserver;
  currentTab$: Observable<number>;
  first: HTMLLIElement | false = false;
  last: HTMLLIElement | false = false;
  leftOverflowSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
  rightOverflowSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
  scrollable: boolean = false;
  destroy$ = new Subject();

  handleOverflowButtonClick($event: MouseEvent, direction: 'RIGHT' | 'LEFT') {
    let left = direction === 'LEFT';
    this.list.nativeElement.scrollBy(left ? -100 : 100, 0);
    $event.preventDefault();
  }
  private updateAnimationState(animationFinished: boolean) {
    let { SHIFTED, UNSHIFTED, SHIFTING, UNSHIFTING } = TabAnimationState;
    if (animationFinished) {
      return this.rounded_ ? SHIFTED : UNSHIFTED;
    } else {
      //In case animations are disabled
      setTimeout(() => this.finishAnimation(), this.animationDuration);
      return this.rounded_ ? SHIFTING : UNSHIFTING;
    }
  }

  finishAnimation() {
    if (
      this.animationState === TabAnimationState.SHIFTING ||
      this.animationState === TabAnimationState.UNSHIFTING
    ) {
      this.animationState = this.updateAnimationState(true);
    }
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

  ngOnDestroy() {
    this.intersectionObserver.disconnect();
    this.destroy$.next(true);
  }
  ngAfterViewInit() {
    this.intersectionObserver = this.createIntersectionObserver();
    this.items.changes.pipe(destroy(this)).subscribe((tabs) => {
      this.observeTabs(this.intersectionObserver);
    });
    this.observeTabs(this.intersectionObserver);
  }

  private intersectingTabCallback(entries: IntersectionObserverEntry[]) {
    for (let { target, isIntersecting } of entries) {
      if (this.first === target) {
        this.leftOverflowSource.next(isIntersecting === false);
      }
      if (this.last === target) {
        this.rightOverflowSource.next(isIntersecting === false);
      }
    }
  }
  private createIntersectionObserver() {
    return new IntersectionObserver(this.intersectingTabCallback.bind(this), {
      root: this.list.nativeElement,
      threshold: [0.95],
    });
  }

  private observeTabs(observer: IntersectionObserver) {
    this.first = this.items.first?.nativeElement || false;
    this.last = this.items.last?.nativeElement || false;
    if (this.first instanceof HTMLElement) {
      observer.observe(this.first);
    }
    if (this.items.length < 2) return;
    if (this.last instanceof HTMLElement) {
      observer.observe(this.last);
    }
  }

  constructor(
    public tableService: TableService,
    private renderer: Renderer2,
    private element: ElementRef
  ) {}
}

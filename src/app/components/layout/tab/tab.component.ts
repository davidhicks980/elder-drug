import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

import { TableService } from '../../../services/table.service';
import { tabAnimations } from './tab.animations';

@Component({
  selector: 'elder-tabs',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  animations: [tabAnimations.fade('fadeButtons'), tabAnimations.round('roundTab')],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('list') list: ElementRef<HTMLUListElement>;
  @ViewChildren('item') items: QueryList<ElementRef<HTMLLIElement>>;
  @HostListener('mouseup')
  handleMouseUp() {
    this.scrollable = false;
  }
  currentTab$: Observable<number>;
  loaded: boolean = false;
  track: boolean = false;
  mouseOver = 0;
  first: HTMLLIElement | false = false;
  last: HTMLLIElement | false = false;
  @Input() rounded: boolean = false;
  @Output() activeTable = new EventEmitter<number>();
  intersectionObserver: IntersectionObserver;
  leftOverflow: BehaviorSubject<boolean> = new BehaviorSubject(false);
  rightOverflow: BehaviorSubject<boolean> = new BehaviorSubject(false);
  scrollable: boolean = false;
  handleTabClick(table: number) {
    this.tableService.emitSelectedTable(table);
  }
  handleMouseDown($event: MouseEvent, direction: 'RIGHT' | 'LEFT') {
    let right = direction === 'RIGHT';
    this.scrollable = true;
    interval(10)
      .pipe(takeWhile(() => this.scrollable === true))
      .subscribe(() => {
        this.list.nativeElement.scrollBy(right ? -5 : 5, 0);
      });
    $event.preventDefault();
  }

  ngOnDestroy() {
    this.intersectionObserver.disconnect();
  }
  ngAfterViewInit() {
    this.intersectionObserver = new IntersectionObserver(
      (e: IntersectionObserverEntry[]) => {
        let entry = e[0];

        if (this.first === entry.target) {
          this.leftOverflow.next(!entry.isIntersecting);
        }
        if (this.last === entry.target) {
          this.rightOverflow.next(!entry.isIntersecting);
        }
      },
      {
        root: this.list.nativeElement,
        threshold: [1],
      }
    );
    this.items.changes.subscribe((tabs) => {
      this.setEdgeTabs();
    });
    this.setEdgeTabs();
  }
  private setEdgeTabs() {
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

  ngOnInit() {}
  constructor(public tableService: TableService, private r: Renderer2) {
    this.currentTab$ = this.tableService.selection$.pipe(map((table) => table.tableNumber));
  }
}

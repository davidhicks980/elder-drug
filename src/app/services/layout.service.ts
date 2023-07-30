import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export enum SearchDrawerState {
  OPENED = 'opened',
  OPENING = 'opening',
  CLOSED = 'closed',
  CLOSING = 'closing',
}

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private mobileQuery = window.matchMedia('(max-width:600px)');
  private mobileSource = new BehaviorSubject(this.mobileQuery.matches);
  mobile$ = this.mobileSource.asObservable();
  private showDirectionsSource = new BehaviorSubject<boolean>(true);
  showDirections$ = this.showDirectionsSource.asObservable();
  private mobileSearchDrawerShiftDuration_: number = 300;
  private searchDrawerShiftDuration_: number = 375;
  private pinnedSearchSource = new BehaviorSubject(false);
  private tableCollapsedSource = new BehaviorSubject(false);
  tableCollapsed$ = this.tableCollapsedSource.asObservable();
  pinnedSearch$ = this.pinnedSearchSource.asObservable();
  private searchDrawerStateSource: BehaviorSubject<SearchDrawerState>;
  searchDrawerState$: Observable<{
    opened: boolean;
    opening: boolean;
    closed: boolean;
    closing: boolean;
  }>;

  emitTableCollapsed(collapsed: boolean) {
    this.tableCollapsedSource.next(collapsed);
  }
  toggleSidenav(pinned: boolean = false, force?: boolean) {
    if (
      this.searchDrawerStateSource.value === SearchDrawerState.CLOSED ||
      this.searchDrawerStateSource.value === SearchDrawerState.OPENED
    ) {
      //For some reason, the null coalescing operator does not work in production mode
      //So I have to determine the value of isForced prior to obtaining the sidebar state
      const opening = typeof force === 'boolean' ? force : !this.isSidenavOpen;
      const nextState = opening ? SearchDrawerState.OPENING : SearchDrawerState.CLOSING;
      this.searchDrawerStateSource.next(nextState);
      if (nextState === SearchDrawerState.OPENING) {
        this.pinnedSearchSource.next(pinned);
      }
    }
  }
  get searchDrawerState() {
    return this.searchDrawerStateSource.value;
  }
  completeSearchDrawerAnimation() {
    if (this.searchDrawerStateSource.value === SearchDrawerState.CLOSING) {
      this.searchDrawerStateSource.next(SearchDrawerState.CLOSED);
    } else if (this.searchDrawerStateSource.value === SearchDrawerState.OPENING) {
      this.searchDrawerStateSource.next(SearchDrawerState.OPENED);
    }
  }

  togglePinnedSearchbar(force?: boolean) {
    this.pinnedSearchSource.next(typeof force === 'boolean' ? force : !this.isSearchPinned);
  }

  get isSearchPinned() {
    return this.pinnedSearchSource.getValue();
  }
  get currentShiftDuration() {
    return this.isMobile ? this.mobileSearchDrawerShiftDuration_ : this.searchDrawerShiftDuration_;
  }

  get searchDrawerShiftDuration() {
    return this.searchDrawerShiftDuration_;
  }
  get mobileSearchDrawerShiftDuration() {
    return this.mobileSearchDrawerShiftDuration_;
  }
  set mobileSearchDrawerShiftDuration(time: number) {
    this.mobileSearchDrawerShiftDuration_ = time;
  }
  set searchDrawerShiftDuration(time: number) {
    this.searchDrawerShiftDuration_ = time;
  }
  get isMobile() {
    return this.mobileSource.value;
  }
  get isSidenavOpen() {
    return (
      this.searchDrawerStateSource.value === SearchDrawerState.OPENED ||
      this.searchDrawerStateSource.value === SearchDrawerState.OPENING
    );
  }
  get areDirectionsShown() {
    return this.showDirectionsSource.getValue();
  }

  hideDirections() {
    this.showDirectionsSource.next(false);
  }
  showDirections() {
    this.showDirectionsSource.next(true);
  }

  constructor(private route: ActivatedRoute) {
    this.mobileQuery.addEventListener('change', (query) => {
      this.mobileSource.next(query.matches);
    });
    this.searchDrawerStateSource = new BehaviorSubject(
      this.route.snapshot.queryParams.drug?.length
        ? SearchDrawerState.CLOSED
        : SearchDrawerState.OPENED
    );
    this.searchDrawerState$ = this.searchDrawerStateSource.asObservable().pipe(
      map((state) => ({
        opened: state === SearchDrawerState.OPENED,
        opening: state === SearchDrawerState.OPENING,
        closed: state === SearchDrawerState.CLOSED,
        closing: state === SearchDrawerState.CLOSING,
      }))
    );
  }
}

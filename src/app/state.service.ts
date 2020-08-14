import { Injectable, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  public sidenavOpen: boolean = true;
  private sidenavSource = new Subject<boolean>();
  sidenavStatus$ = this.sidenavSource.asObservable();

  private tableStatusSource = new Subject<string[]>();
  public activeTables: string[];
  tableStatus$ = this.tableStatusSource.asObservable();
  toggleSidenav() {
    this.sidenavOpen = !this.sidenavOpen;
    this.sidenavSource.next(this.sidenavOpen);
  }
  emitSelectedTables(tables) {
    this.tableStatusSource.next(tables);
  }

  constructor() {}
}

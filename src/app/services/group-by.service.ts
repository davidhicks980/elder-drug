import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GroupByService {
  tableGroupSource = new BehaviorSubject([]) as BehaviorSubject<string[]>;
  emitGroupChange(groups) {
    this.tableGroupSource.next(groups);
  }
  /**
   * An observable containing the groupings displayed in the drug table.
   * @readonly
   * @memberof GroupByService
   */
  get groups$(): Observable<string[]> {
    return this.tableGroupSource.asObservable();
  }
  constructor() {}
}

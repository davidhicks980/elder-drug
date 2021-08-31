import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GroupByService {
  tableGroupsChanged = new BehaviorSubject([]) as BehaviorSubject<string[]>;
  groupChange$ = this.tableGroupsChanged.asObservable();
  changeGroups(groups) {
    this.tableGroupsChanged.next(groups);
  }
  /**
   * An observable containing the groupings displayed in the drug table.
   * @readonly
   * @memberof GroupByService
   */
  get groupChanges(): Observable<string[]> {
    return this.groupChange$;
  }
  constructor() {}
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GroupByService {
  tableGroupsChanged = new BehaviorSubject([]);

  changeGroups(groups) {
    this.tableGroupsChanged.next(groups);
  }
  constructor() {}
}

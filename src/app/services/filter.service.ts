import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class FilterService {
  private filterSource = new BehaviorSubject('');
  filter$ = this.filterSource.asObservable();
  get filter() {
    return this.filterSource.value;
  }
  updateFilter(value: string) {
    this.filterSource.next(value);
  }
}

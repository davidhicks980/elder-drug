import { Injectable } from '@angular/core';
import { enableES5, enableMapSet, enablePatches } from 'immer';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

const validateObj = (o: Object) => {
  if (typeof o === 'object' && o !== null) {
    return true;
  } else {
    throw new TypeError(`[validateObj] Object is not valid or does not contain properties`);
  }
};
export type StateUpdate<T> = Record<string, T>;
enablePatches();
enableES5();
enableMapSet();
@Injectable()
export class StateService {
  private _changes: BehaviorSubject<{ [key: string]: unknown }>;
  private _store: BehaviorSubject<{ [key: string]: unknown }>;
  private changes$: Observable<Record<string, any>>;
  private store$: Observable<Record<string, any>>;

  constructor() {
    this._changes = new BehaviorSubject({});
    this._store = new BehaviorSubject({});
    [this.changes$, this.store$] = [this._changes, this._store].map((sub) =>
      sub.asObservable().pipe(map((state) => Array.from(Object.entries(state))))
    );
  }
  hookPropertyUpdates() {
    return this.update.bind(this);
  }
  private _filterSubject(property: string, filters: string[]): Observable<Record<string, unknown>> {
    return this[property].pipe(
      filter((state: [string, any][]) => state.some(([key, value]) => filters.includes(key))),
      map((state: [string, any][]) => {
        return state.reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {});
      })
    );
  }
  filteredChanges(filter: string[]): Observable<Record<string, unknown>> {
    return this._filterSubject('changes$', filter);
  }
  filteredStore(filter: string[]): Observable<Record<string, unknown>> {
    return this._filterSubject('store$', filter);
  }
  update<T>(stateUpdate: StateUpdate<T>) {
    if (validateObj(stateUpdate)) {
      const value = this._store.value;
    } else {
      throw Error('Provided stateUpdate is not an object!');
    }
  }
}

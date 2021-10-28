import { Inject, Injectable } from '@angular/core';
import { doc, docData, DocumentData, Firestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { filter, map, mapTo, take, tap } from 'rxjs/operators';

import { BEERS_ENTRIES } from '../injectables/brand-drugs.injectable';
import { BeersEntry } from '../interfaces/BeersEntry';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dataSource: ReplaySubject<DocumentData> = new ReplaySubject(1);
  private entries: Map<number, BeersEntry>;
  private errorSource = new Subject();
  error$ = this.errorSource.asObservable();
  private getFirebaseData(): Observable<Record<string, number[]>> {
    return docData(doc(this.firestore, 'dropdown/dropdownItems'));
  }

  /**
   * Object containing drug names and associated tables. Used to lookup entries when searching
   *  ```
   * {
   *  aspirin: [1, 2, 3, 4],
   *  alprazolam: [3, 2, 1 ,1]
   * }
   * ```
   *
   * @readonly
   * @memberof DataService
   * @returns {Record<string, number[]>}  Object containing drug names mapped to table numbers
   */
  entriesMappedToTables$: Observable<Record<string, number[]>> = this.dataSource.asObservable();

  /**
   * Returns a list of all drug names.
   *
   * @readonly
   * @memberof DataService
   * @returns {Observable<string[]>} a list of brand and generic drug names corresponding to Beers Criteria entries,
   */
  drugList$: Observable<string[]> = this.dataSource
    .asObservable()
    .pipe(map((drugs) => Object.keys(drugs).map((drug) => drug.toLowerCase())));

  dataAcquired$: Observable<boolean> = this.dataSource.asObservable().pipe(take(1), mapTo(true));
  get drugEntries(): Map<number, BeersEntry> {
    return this.entries;
  }
  private createBeersMap() {
    return new Map(this.beersEntries.map((item) => [item.EntryID, item]));
  }
  constructor(
    private firestore: Firestore,
    @Inject(BEERS_ENTRIES) private beersEntries: BeersEntry[]
  ) {
    this.getFirebaseData()
      .pipe(take(1))
      .subscribe((data) => {
        if (typeof data === 'undefined') {
          this.emitError();
        } else {
          this.dataSource.next(data);
        }
      });
    this.entries = this.createBeersMap();
  }
  emitError() {
    this.errorSource.next(true);
  }
}

export interface ColumnTemplate {
  name: string;
  value: string;
}
export type ColumnInfo = {
  id: number;
  field: string;
  header: string;
};

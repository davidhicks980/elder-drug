import { Inject, Injectable } from '@angular/core';
import { doc, docData, DocumentData, Firestore } from '@angular/fire/firestore';
import { Observable, ReplaySubject } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { BEERS_ENTRIES } from '../injectables/brand-drugs.injectable';
import { BeersEntry } from '../interfaces/BeersEntry';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dataSource: ReplaySubject<DocumentData> = new ReplaySubject(1);
  private entries: Map<number, BeersEntry>;
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
  get entriesMappedToTables$(): Observable<Record<string, number[]>> {
    return this.dataSource.asObservable();
  }
  /**
   * Returns a list of all drug names.
   *
   * @readonly
   * @memberof DataService
   * @returns {Observable<string[]>} a list of brand and generic drug names corresponding to Beers Criteria entries,
   */
  get drugList$(): Observable<string[]> {
    return this.dataSource
      .asObservable()
      .pipe(map((drugs) => Object.keys(drugs).map((drug) => drug.toLowerCase())));
  }

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
        console.log(data);
        this.dataSource.next(data);
      });
    this.entries = this.createBeersMap();
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

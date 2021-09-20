import { Inject, Injectable } from '@angular/core';
import { doc, docData, DocumentData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { BEERS_ENTRIES } from '../injectables/brand-drugs.injectable';
import { BeersEntry } from '../interfaces/BeersEntry';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  beersMap: Map<number, BeersEntry>;
  drugIndex: Map<string, string[]> = new Map();
  drugSet: Set<any>;
  drugMap: Map<string, number[]>;
  searches = new Map();
  regex: RegExp;
  allDrugs: string[] = [];
  private _drugTableMapping: DocumentData;
  dataSource$: Observable<DocumentData>;

  private getFirebaseData(): Observable<DocumentData> {
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
    return this.dataSource$;
  }
  get drugList$() {
    return this.dataSource$.pipe(map((drugs) => Object.keys(drugs)));
  }

  createBeersMap() {
    return new Map(this.beersEntries.map((item) => [item.EntryID, item]));
  }
  constructor(
    private firestore: Firestore,
    @Inject(BEERS_ENTRIES) private beersEntries: BeersEntry[]
  ) {
    this.dataSource$ = this.getFirebaseData().pipe(take(1));
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

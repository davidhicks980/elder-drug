import { Injectable } from '@angular/core';
import { doc, docData, DocumentData, Firestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import * as beers from '../../assets/beers-entries.json';
import * as generics from '../../assets/generics-lookup.json';
import { BeersField } from './BeersField';
import { Category as TabletCategory, ColumnField, ColumnService } from './columns.service';
import { TableService } from './table.service';

/* eslint-disable @typescript-eslint/member-ordering */
@Injectable({
  providedIn: 'root',
})
export class DataService {
  items: Observable<unknown>;
  beersArray: number[];
  dropdown: Observable<unknown>;
  updatedTables = new Subject<any>();
  queriedTables$ = this.updatedTables.asObservable();
  entryMap: Map<string, number[]> = new Map();
  public tableSource: BehaviorSubject<BeersField[]> = new BehaviorSubject([]);
  private activeTables: Subject<TabletCategory[]> = new Subject<number[]>();
  private drugIndex: Map<string, string[]> = new Map();
  private searchHistory: BehaviorSubject<string[]> = new BehaviorSubject([]);
  dropdownParameters: any;
  loaded: boolean;
  beersMap: Map<number, BeersField> = (beers as any).default;
  filterDropdown = new Subject<string[][]>();
  filteredItems$ = this.filterDropdown.asObservable();
  genericsLookup = {};
  /** Emits table columns that contain any data */
  private filteredFieldsSource: ReplaySubject<ColumnField[]> =
    new ReplaySubject(1);

  /** Observable for columns containing data */
  filteredFields$ = this.filteredFieldsSource.asObservable();

  drugSet: Set<any>;
  drugMap: Map<string, number[]>;
  searches = new Map();
  regex: RegExp;

  private getFirebaseData(): Observable<DocumentData> {
    const reference = doc(this.firestore, 'dropdown/dropdownItems');
    return docData(reference);
  }

  get lastSearch() {
    return this.searchHistory.getValue();
  }
  storeHistory(drugs: string[]) {
    this.searchHistory.next(this._validateSearch(drugs));
  }
  private _validateSearch(drugs) {
    const regex = /[\w\s\,\_.\+\$]+/;
    return drugs
      .filter((val) => regex.test(val))
      .filter((val) => this.hasDrug(val));
  }

  searchDrugs(terms?: string | string[]) {
    let drugs = terms || this.searchHistory.value;
    if (typeof drugs === 'string') {
      drugs = [drugs];
    }
    if (Array.isArray(drugs) && drugs.length > 0) {
      const hashMap = drugs.reduce((hashMap, entry) => {
        for (let index of this.drugMap.get(entry)) {
          if (index in hashMap && 'SearchTerms' in hashMap[index]) {
            hashMap[index].SearchTerms = hashMap[index].SearchTerms + entry;
          } else {
            hashMap[index] = Object.assign(this.beersMap.get(index), {
              SearchTerms: entry,
            });
          }
        }
        return hashMap;
      }, {}) as BeersField[];

      let resultsArray = [...Object.values(hashMap)] as BeersField[];
      this.emitTableInformation(resultsArray);
    }
  }

  getResults(drug: string, hashMap: Record<number, BeersField>) {
    let drugIndices = this.drugMap.get(drug);
    for (let index of drugIndices) {
      if (index in hashMap && 'SearchTerms' in hashMap[index]) {
        hashMap[index].SearchTerms = [...hashMap[index].SearchTerms, drug];
      } else {
        hashMap[index] = Object.assign(this.beersMap.get(index), {
          SearchTerms: [drug],
        });
      }
    }
    return hashMap;
  }

  emitTableInformation(tableData: BeersField[]) {
    let activeFields = [] as string[],
      activeTables = [] as TabletCategory[],
      keys = Object.keys(tableData[0]);
    let containsData = (tables: BeersField[], item: string) => {
      return tables.some((table) => table[item] != null);
    };
    for (let item of keys) {
      if (containsData(tableData, item)) {
        activeFields.push(item);
        if (this.columns.tableExists(item)) {
          activeTables.push(this.columns.retrieveTable(item));
        }
      }
    }
    this.emitActiveTables(activeTables);
    this.emitFields(activeFields);
    this.emitTableData(tableData);
  }

  private emitActiveTables(tables: TabletCategory[]) {
    this.activeTables.next(tables);
  }

  private emitFields(activeColumns: any[]) {
    this.filteredFieldsSource.next(activeColumns);
  }

  private emitTableData(tableList: BeersField[]) {
    this.tableSource.next(tableList);
  }

  filterValues(entry: string) {
    if (entry) {
      const first = entry[0].toLowerCase();
      return this.drugIndex
        .get(first)
        .filter((val) => val.startsWith(entry.toLowerCase()))
        .slice(0, 10);
    }
  }

  hasDrug(drugName: string) {
    return this.drugSet.has(drugName.toLowerCase());
  }

  private initializeData() {
    this.getFirebaseData()
      .pipe(take(1))
      .subscribe((res: DocumentData) => {
        this.drugMap = this.createDrugMap(res);
        const keys = Object.keys(res);
        this.drugSet = new Set(keys);
        this.drugIndex = this.createDrugIndex(keys);
        this.loaded = true;
      });
  }

  constructor(
    private firestore: Firestore,
    private tableService: TableService,
    private columns: ColumnService
  ) {
    this.beersMap = new Map(
      (beers as any).default.map((item) => [item.EntryID, item])
    );
    this.genericsLookup = (generics as any).default;
    this.initializeData();
    this.activeTables.subscribe((tables: number[]) =>
      this.tableService.emitSelectedTables(tables)
    );
  }

  private createDrugIndex(list: string[]) {
    let letter = '',
      i = 0,
      map = new Map();
    for (i = 0; i < 26; i++) {
      letter = (i + 10).toString(36);
      let alphaDrugs = list.filter((name: string) => name.startsWith(letter));
      const genericList = alphaDrugs
        .filter((drug) => this.genericsLookup[letter].includes(drug))
        .map((drug) => drug + '~g');
      const brandList = alphaDrugs
        .filter((drug) => !this.genericsLookup[letter].includes(drug))
        .map((drug) => drug + '~b');
      map.set(letter, [...genericList, ...brandList]);
    }
    return map;
  }

  private createDrugMap(list: {}) {
    let key = '';
    let item = '';
    const map = new Map();
    for (item in list) {
      key = item.replace(/\+/gi, ' ').toLowerCase();
      map.set(key, list[item]);
    }
    return map;
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

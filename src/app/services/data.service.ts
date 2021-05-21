import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';

import * as beers from '../../assets/beers-entries.json';
import * as generics from '../../assets/generics-lookup.json';
import { Category, ColumnField, ColumnService } from './columns.service';
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
  private activeTables: Subject<Category[]> = new Subject<number[]>();
  private drugIndex: Map<string, string[]> = new Map();
  private searchHistory: BehaviorSubject<string[]> = new BehaviorSubject([]);
  dropdownParameters: any;
  loaded: any;
  beersMap: Map<number, BeersField> = (beers as any).default;
  filterDropdown = new Subject<string[][]>();
  filteredItems$ = this.filterDropdown.asObservable();
  genericsLookup = {};
  /** Emits table columns that contain any data */
  private filteredFieldsSource: ReplaySubject<
    ColumnField[]
  > = new ReplaySubject(1);

  /** Observable for columns containing data */
  filteredFields$ = this.filteredFieldsSource.asObservable();

  drugSet: Set<any>;
  drugMap: Map<string, number[]>;
  searches = new Map();
  regex: RegExp;

  private async getFirebaseData(fire: any) {
    const reference = await fire
      .collection('dropdown')
      .doc('dropdownItems')
      .ref.get();

    return await reference.data();
  }

  hasDrugStream(value: string): Observable<boolean | null> {
    return of(this.drugSet.has(value.toLowerCase())).pipe(
      catchError(() => of(null))
    );
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

  searchDrugs(terms?: any[]) {
    let drugs = terms || this.searchHistory.value;
    let hashMap = {};
    let drug = '';
    if (Array.isArray(drugs) && drugs.length > 0) {
      for (drug of drugs) {
        hashMap = this.createSearchMap(drug, hashMap);
      }
      let resultsArray = [...Object.values(hashMap)] as BeersField[];
      this.processSelectedTables(resultsArray);
    }
  }

  createSearchMap(drug: string, hash: { [key: number]: any }) {
    let drugIndices = this.drugMap.get(drug);
    for (let index of drugIndices) {
      hash[index] =
        index in hash
          ? (hash[index].SearchTerms = hash[index].SearchTerms + ' , ' + drug)
          : Object.assign(this.beersMap.get(index), {
              SearchTerms: drug,
            });
    }

    return hash;
  }

  processSelectedTables(tableData: BeersField[]) {
    const activeFields = [] as any[],
      activeTables = [] as Category[];
    let item;
    let keys = Object.keys(tableData[0]);
    let containsData = (tables, item) =>
      tables.map((table) => table[item]).length > 0;
    for (item of keys) {
      if (containsData(tableData, item)) {
        activeFields.push(item);
        if (this.columns.tableExists(item))
          activeTables.push(this.columns.retrieveTable(item));
      }
    }
    this.emitActiveTables(activeTables);
    this.emitFields(activeFields);
    this.emitTableData(tableData);
  }

  private emitActiveTables(tables: Category[]) {
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

  constructor(
    firestore: AngularFirestore,
    private tableService: TableService,
    private columns: ColumnService
  ) {
    this.beersMap = new Map(
      (beers as any).default.map((item) => [item.EntryID, item])
    );
    this.genericsLookup = (generics as any).default;

    this.getFirebaseData(firestore).then((res) => {
      this.drugMap = this.createDrugMap(res);
      const keys = Object.keys(res);
      this.drugSet = new Set(keys);
      this.drugIndex = this.createDrugIndex(keys);
      this.loaded = true;
    });

    this.activeTables.subscribe((tables: number[]) =>
      tableService.emitSelectedTables(tables)
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

export interface Drug {
  name: string;
  rxnormId: number;
  EntryID: number;
  uri: string;
  brands?: [
    {
      name: string;
      rxcui: number;
    }
  ];
}
export interface BeersEntry {
  EntryID?: number;
  DiseaseState?: string;
  Category?: number;
  Item?: string;
  MinimumClearance?: number;
  MaximumClearance?: number;
  Interaction?: string;
  Inclusion?: string;
  Exclusion?: string;
  Rationale?: string;
  Recommendation?: string;
  RecommendationLineTwo?: string;
  ItemType?: string;
  ShortName?: string;
}

export interface columnTemplate {
  name: string;
  value: string;
}
export type ColumnInfo = {
  id: number;
  field: string;
  header: string;
};

export interface BeersField {
  EntryID: number;
  DiseaseState: string;
  Category: number;
  TableDefinition: string;
  Item: string;
  MinimumClearance: number;
  MaximumClearance: number;
  DrugInteraction: string;
  Inclusion: string;
  Exclusion: string;
  Rationale: string;
  Recommendation: string;
  RecommendationLineTwo: string;
  ItemType: string;
  ShortTableName: string;
  SearchTerms?: string[];
}

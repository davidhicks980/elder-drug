import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';

import * as beers from '../../assets/beers-entries.json';
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
  public tableSource: BehaviorSubject<Table[]> = new BehaviorSubject([]);
  private activeTables: Subject<Category[]> = new Subject<number[]>();
  private drugIndex: Map<string, string[]> = new Map();
  private searchHistory: BehaviorSubject<string[]> = new BehaviorSubject([]);
  dropdownParameters: any;
  loaded: any;
  beersMap: Map<number, Table> = (beers as any).default;
  filterDropdown = new Subject<string[][]>();
  filteredItems$ = this.filterDropdown.asObservable();
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

  get lastSearch() {
    return this.searchHistory.getValue();
  }
  changeDrugs = () => {
    const regex = /[\w\s\,\_.\+\$]+/;
    const validateSearch = (drugs: string[]) =>
      drugs.filter((val) => regex.test(val));

    return (drugs: string[]) => this.searchHistory.next(validateSearch(drugs));
  };

  searchDrugs() {
    const searchMap = new Map() as Map<number, Table>;
    const drugs = this.searchHistory.value;
    let drug = '';
    if (Array.isArray(drugs) && drugs.length > 0) {
      for (drug of drugs) {
        this.createSearchMap(drug, searchMap);
      }
      this.processSelectedTables(Array.from(searchMap.values()));
      console.log(searchMap);
    }
  }

  private createSearchMap(drug: string, searchMap: Map<number, Table>) {
    this.drugMap.get(drug).reduce((acc, curr) => {
      acc.has(curr)
        ? acc.get(curr).SearchTerms.push(drug)
        : acc.set(
            curr,
            Object.assign(this.beersMap.get(curr), {
              SearchTerms: [drug],
            })
          );
      return searchMap;
    }, searchMap);
  }

  processSelectedTables(tableData: Table[]) {
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

  private emitTableData(tableList: Table[]) {
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
    return this.drugSet.has(drugName);
  }

  constructor(
    firestore: AngularFirestore,
    private tableService: TableService,
    private columns: ColumnService
  ) {
    this.beersMap = new Map(
      (beers as any).default.map((item) => [item.EntryID, item])
    );

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
      map.set(
        letter,
        list.filter((name: string) => name.startsWith(letter))
      );
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

export interface Table {
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
/*let createTableObjects = (
      mappedTerms: Table[],
      categories: number[],
      definitions: columnDefinition[],
      columns: Column[]
    ): TableParameters[] => {
      let tables: TableParameters[] = [];

      for (let category of categories) {
        //If the table category is general, use all tables
        let generalInfo = category === Category.General;
        const table = generalInfo
          ? mappedTerms
          : mappedTerms.filter((item: Columns) => item.Category == category);
        //Check to see if tables exist and contain items
        if (table) {
          if (table.length > 0) {
            //Get the columns that are relevant to the displayed table
            const fields = this.getColFields(definitions, columns).get(
              category
            );
            const { selected, displayed } = fields;
            const displayedColumns = Array.from(
              table.reduce((acc: Set<string>, curr: Table) => {
                // Iterate through each entry in a specific drug table
                for (let key in curr) {
                  const displayedFields = displayed.map((item) => item.field);
                  if (key === 'SearchTerm') {
                    acc.add(key);
                  } else if (curr[key] && displayedFields.includes(key)) {
                    acc.add(key);
                  }
                }
                return acc;
              }, new Set()) as Set<string>
            ) as string[];

            tables.push({
              id: category,
              tables: table,
              fields: displayedColumns,
              selected: [...selected.map((item) => item.field)],
            });
          }
        }
      }
      return tables;
    };

    this.activeTables.next(this.getTableNamesContainingData(mappedTerms));
    const tables = createTableObjects(
      mappedTerms,
      categories,
      this.columnDefinitions,
      this.columnOptions
    );*/

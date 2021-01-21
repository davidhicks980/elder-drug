import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';

import * as beers from '../assets/beers-entries.json';
import { Category, ColumnField } from './columns.service';
import { TableService } from './table.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  items: Observable<unknown>;
  beersArray: number[];
  dropdown: Observable<unknown>;
  updatedTables = new Subject<any>();
  queriedTables$ = this.updatedTables.asObservable();
  entryMap: Map<string, number[]> = new Map();
  public tableSource: BehaviorSubject<Table[]> 
  private activeTables: Subject<Category[]> = new Subject<number[]>();
  private queryMap: Map<number, string[]> = new Map();
  dropdownItems: Map<string, string[]> = new Map();
  dropdownParameters: any;
  loaded: any;
  beersMap: Map<number, {}> = new Map();
  beersObjects: any = (beers as any).default;
  filterDropdown = new Subject<string[][]>();
  filteredItems$ = this.filterDropdown.asObservable();
  /** Emits table columns that contain any data */
  private filteredFieldsSource: ReplaySubject<
    ColumnField[]
  > = new ReplaySubject(1);

  /** Observable for columns containing data */
  filteredFields$ = this.filteredFieldsSource.asObservable();

  tableData = new Map();
  private _activeTable: number;

  /* private getColFields(
    definitions: columnDefinition[],
    columnOptions: Column[]
  ): Map<number, { displayed: Column[]; selected: Column[] }> {
    let tableFields = new Map() as Map<
      number,
      { displayed: Column[]; selected: Column[] }
    >;
    for (let def of definitions) {
      let displayIndices = def.columnOptions.map((item) => item.id);
      let selectIndices = def.columnOptions
        .filter((item) => item.selected === true)
        .map((item) => item.id);
      const displayedOptions = columnOptions.filter((item) =>
        displayIndices.includes(item.field)
      );
      const selectedOptions = columnOptions.filter((item: ColumnDefinition) =>
        selectIndices.includes(item.field)
      );
      tableFields.set(def.id, {
        displayed: displayedOptions,
        selected: selectedOptions,
      });
    }
    return tableFields;
  }*/
  private queryBeers(drugs: number[]) {
    const compiledArray = [];
    for (const drug of drugs) {
      compiledArray.push(this.beersMap.get(drug));
    }
    return compiledArray;
  }

  private async queryBeersDropdown(fire: any) {
    const reference = await fire
      .collection('dropdown')
      .doc('dropdownItems')
      .ref.get();

    return await reference.data();
  }
  searchDrugs(drugs: string[]) {
    const indexArray = [];
    for (const drug of drugs) {
      const indices = this.entryMap.get(drug);
      indexArray.push(...indices);
      for (const index of indices) {
        this.getSearches(index, drug);
      }
    }
    this.emitTables(this.queryBeers(indexArray));
  }
  getSearches(entryID: number, drug: string) {
    if (this.queryMap.has(entryID)) {
      const mappedDrugs = this.queryMap.get(entryID);
      if (!mappedDrugs.includes(drug)) {
        mappedDrugs.push(drug);
        this.queryMap.set(entryID, mappedDrugs);
      }
    } else {
      this.queryMap.set(entryID, [drug]);
    }
  }
  getTableNamesContainingData(tables: Table[]): number[] {
    let out = new Set() as Set<number>;
    tables.forEach((table) => {
      out.add(1);

      if (
        [
          Category.DiseaseGuidance,
          Category.DrugInteractions,
          Category.RenalEffect,
        ].includes(table.Category)
      )
        out.add(table.Category);
    });
    return [...out];
  }
  emitTables(tableList: any[]) {
    const mappedTerms = this.getUniqueListBy(
      this.mapQueryTerms(tableList),
      'EntryID'
    ) as Table[];
    let columnsWithData = [] as ColumnField[];
    let dataMappedToColumns = [];
    let tablesWithData = [] as Category[];
    let i = 0;
    for (let item in mappedTerms[0]) {
      dataMappedToColumns[item] = mappedTerms.map((table) => table[item]);

      if (dataMappedToColumns[item].length > 0) {
        columnsWithData.push(item);
        switch (item) {
          case ColumnField.DiseaseState:
            {
              tablesWithData.push(Category.DiseaseGuidance);
            }
            break;
          case ColumnField.DrugInteraction:
            {
              tablesWithData.push(Category.DrugInteractions);
            }
            break;
          case ColumnField.MinimumClearance || ColumnField.MaximumClearance:
            {
              tablesWithData.push(Category.RenalEffect);
            }
            break;
        }
      }
    }
    this.tableService.emitSelectedTables(tablesWithData);
    this.filteredFieldsSource.next( columnsWithData );
     !this.tableSource?
     this.tableSource = new BehaviorSubject(mappedTerms):this.tableSource.next(mappedTerms);
    this.tableData.set(Date.now(), mappedTerms);
  }

  mapQueryTerms(tables: {}[]) {
    for (const table of tables) {
      table['SearchTerm'] = this.queryMap.get(table['EntryID']).join(' | ');
    }
    return tables;
  }

  filterValues(entry: string) {
    if (entry) {
      const first = entry[0].toLowerCase();
      this.filterDropdown.next(
        this.dropdownItems
          .get(first)
          .filter((val) => val.startsWith(entry.toLowerCase()))
          .slice(0, 10)
          .map((item: string) => [entry, item.substr(entry.length, Infinity)])
      );
    }
  }
  createDropdownMap(list: {}) {
    const dropdown = [];
    let key: string = '';
    let i = 0;
    let letter: string;
    for (const item in list) {
      key = item.replace(/\+/gi, ' ').toLowerCase();
      dropdown.push(key);
      this.entryMap.set(key, list[item]);
    }
    //Map each letter to respective drug names;
    for (i = 0; i < 26; i++) {
      letter = (i + 10).toString(36);
      this.dropdownItems.set(
        letter,
        dropdown.filter((name: string) => name.startsWith(letter))
      );
    }
  }

  getUniqueListBy = (arr, key) => {
    return [...new Map(arr.map((item) => [item[key], item])).values()] as {}[];
  };

  constructor(
    private firestore: AngularFirestore,
    private tableService: TableService
  ) {
    this.queryBeersDropdown(firestore).then((res) => {
      this.createDropdownMap(res);
      this.loaded = true;
    });
    this.beersObjects.forEach((item) => this.beersMap.set(item.EntryID, item));
    this.activeTables.subscribe((tables: number[]) =>
      tableService.emitSelectedTables(tables)
    );
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

export interface Columns {
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
  SearchTerm: string;
}
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
  SearchTerm: string;
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

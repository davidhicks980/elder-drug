import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ColumnService {
  constructor() {}
  static receiveTables$: any;

  public columnOptions = [
    { id: 1, field: 'EntryID', header: 'Entry Number' },
    { id: 2, field: 'DiseaseState', header: 'Disease State' },
    { id: 3, field: 'Category', header: 'Category Number' },
    { id: 4, field: 'TableDefinition', header: 'Table Definition' },
    { id: 5, field: 'MatchedBeersEntry', header: 'Item' },
    { id: 6, field: 'MinimumClearance', header: 'Min Clearance' },
    { id: 7, field: 'MaximumClearance', header: 'Max Clearance' },
    { id: 8, field: 'DrugInteraction', header: 'Drug Interaction' },
    { id: 9, field: 'Inclusion', header: 'Includes' },
    { id: 10, field: 'Exclusion', header: 'Excludes' },
    { id: 11, field: 'Rationale', header: 'Rationale' },
    { id: 12, field: 'Recommendation', header: 'Recommendation' },
    { id: 13, field: 'RecommendationLineTwo', header: 'LineTwo' },
    { id: 14, field: 'ItemType', header: 'Type' },
    { id: 15, field: 'ShortTableName', header: 'Table' },
    { id: 16, field: 'SearchTerm', header: 'Search Term' },
  ];

  public columnDefinitions: columnDefinition[] = [
    {
      description: 'General Info',
      filters: [null],
      id: 1,
      columnOptions: [
        { id: Cols.SearchTerm, selected: true },
        { id: Cols.Item, selected: true },
        { id: Cols.Excl, selected: true },
        { id: Cols.Incl, selected: true },
        { id: Cols.Recommendation, selected: true },
        { id: Cols.DiseaseState, selected: true },
        { id: Cols.DrugInter, selected: false },
        { id: Cols.ShortName, selected: true },
      ],
    },
    {
      description: 'Disease-Specific',
      filters: [Cols.DiseaseState],
      id: 3,
      columnOptions: [
        { id: Cols.SearchTerm, selected: true },
        { id: Cols.Item, selected: true },
        { id: Cols.Excl, selected: true },
        { id: Cols.Incl, selected: true },
        { id: Cols.Recommendation, selected: false },
        { id: Cols.DiseaseState, selected: true },
      ],
    },
    {
      description: 'Renal Interactions',
      id: 6,
      filters: [Cols.MaxCl, Cols.MinCl],
      columnOptions: [
        { id: Cols.SearchTerm, selected: true },
        { id: Cols.Item, selected: true },
        { id: Cols.MinCl, selected: true },
        { id: Cols.MaxCl, selected: true },
        { id: Cols.Incl, selected: false },
        { id: Cols.Excl, selected: false },
        { id: Cols.Recommendation, selected: true },
      ],
    },
    {
      description: 'Drug Interactions',
      filters: [Cols.DrugInter],
      id: 5,
      columnOptions: [
        { id: Cols.SearchTerm, selected: true },
        { id: Cols.Item, selected: true },
        { id: Cols.DrugInter, selected: true },
        { id: Cols.Incl, selected: true },
        { id: Cols.Excl, selected: true },
        { id: Cols.Recommendation, selected: true },
        { id: Cols.Rationale, selected: false },
      ],
    },
  ];
  // Observable string sources
  private tableList = new Subject<object>();
  private optionsList = new Subject<object>();

  // Observable string streams
  recieveTables$ = this.optionsList.asObservable();
  recieveOptions$ = this.tableList.asObservable();
  sendTables(tables: object) {
    this.optionsList.next(tables);
  }
  sendOptions(options: object) {
    this.tableList.next(options);
  }
  mapData(data: any[], filter?: string[]) {
    let output = [];
    if (filter[0] != null || filter[1] != null) {
      data.forEach((element) => {
        if (
          element[String(filter[0])] != null ||
          element[String(filter[1])] != null
        ) {
          output.push(element);
        }
      });
    } else if (data.length == 0) {
      output = null;
    } else {
      output = data;
    }
    return output;
  }

  // Service message commands
  getColumnsForSelect(columnOptions: number[]): string[] {
    return this.columnOptions.reduce((acc: string[], curr: ColumnInfo) => {
      if (columnOptions.includes(curr.id)) acc.push(curr.header);
      return acc;
    }, []);
  }

  lookupColumns(columns: { selected: boolean; id: number }[], getAll: boolean) {
    const output: { field: string; header: string }[] = [];
    for (const col of columns) {
      if (col.selected && !getAll)
        output.push(
          this.columnOptions.filter((name) => {
            return name.id === col.id;
          })[0]
        );
    }

    return output;
  }
}
export interface columnDefinition {
  description: string;
  id: number;
  filters: Cols[];
  columnOptions: { id: Cols; selected: boolean }[];
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
export enum Cols {
  EntryID = 1,
  DiseaseState,
  Category,
  TableDefinition,
  Item,
  MinCl,
  MaxCl,
  DrugInter,
  Incl,
  Excl,
  Rationale,
  Recommendation,
  RecommendationLineTwo,
  ShortName,
  SearchTerm,
}

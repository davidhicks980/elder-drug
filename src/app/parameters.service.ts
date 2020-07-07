import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Table } from './table-logic/table-logic.component';

@Injectable({
  providedIn: 'root',
})
export class ParametersService {
  public allColumns = [
    { field: 'EntryID', header: 'Entry Number' },
    { field: 'DiseaseState', header: 'Disease State' },
    { field: 'Category', header: 'Category Number' },
    { field: 'TableDefinition', header: 'Table Definition' },
    { field: 'Item', header: 'Item' },
    { field: 'MinimumClearance', header: 'Min Clearance' },
    { field: 'MaximumClearance', header: 'Max Clearance' },
    { field: 'DrugInteraction', header: 'Drug Interaction' },
    { field: 'Inclusion', header: 'Includes' },
    { field: 'Exclusion', header: 'Excludes' },
    { field: 'Rationale', header: 'Rationale' },
    { field: 'Recommendation', header: 'Recommendation' },
    { field: 'RecommendationLineTwo', header: 'LineTwo' },
    { field: 'ItemType', header: 'Type' },
    { field: 'ShortTableName', header: 'Table' },
    { field: 'SearchTerm', header: 'Search Term' },
  ];
  public columnDefinitions: columnDefinition[] = [
    {
      description: 'General Info',
      active: true,
      filters: [null],
      name: 'GeneralInfo',
      columnOptions: [
        'SearchTerm',
        'ShortTableName',
        'Item',
        'Inclusion',
        'Exclusion',
        'Rationale',
        'Recommendation',
        'DiseaseState',
        'Interaction',
      ],
      selectedColumns: [
        'SearchTerm',
        'Item',
        'ShortTableName',
        'Recommendation',
      ],
    },
    {
      description: 'Disease-Specific',
      active: true,
      filters: ['DiseaseState'],
      name: 'DiseaseGuidance',
      columnOptions: [
        'SearchTerm',
        'Item',
        'Inclusion',
        'Exclusion',
        'Rationale',
        'Recommendation',
      ],
      selectedColumns: [
        'DiseaseState',
        'SearchTerm',
        'Item',
        'Inclusion',
        'Recommendation',
      ],
    },
    {
      description: 'Clearance Ranges',
      name: 'Clearance',
      active: true,
      filters: ['MaximumClearance', 'MinimumClearance'],
      columnOptions: [
        'SearchTerm',
        'Item',
        `MinimumClearance`,
        `MaximumClearance`,
        'Inclusion',
        'Exclusion',
        'Rationale',
        'Recommendation',
      ],
      selectedColumns: [
        'SearchTerm',
        'Item',
        `MinimumClearance`,
        `MaximumClearance`,
        'Inclusion',
        'Recommendation',
      ],
    },
    {
      description: 'Drug Interactions',
      active: true,
      filters: ['DrugInteractions'],
      name: 'DrugInteraction',
      columnOptions: [
        'SearchTerm',
        'Item',
        `Interaction`,
        'Inclusion',
        'Exclusion',
        'Rationale',
        'Recommendation',
      ],
      selectedColumns: [
        `DrugExamples`,
        `SearchTerm`,
        `Item`,
        `DrugInteraction`,
        `Inclusion`,
        `Exclusion`,
        `Recommendation`,
      ],
    },
  ];
  filterInactiveTables(tables: Table[]) {
    let output: string[] = [];
    for (let [key, value] of Object.entries(tables)) {
      let len = value.length;
      if (len > 0) {
        output.push(key);
      }
    }
    return output;
  }
  static receiveTables$: any;
  constructor() {}
  // Observable string sources
  private tableList = new Subject<object>();
  private optionsList = new Subject<object>();

  // Observable string streams
  recieveTables$ = this.optionsList.asObservable();
  recieveOptions$ = this.tableList.asObservable();

  // Service message commands
  sendTables(tables: object) {
    this.optionsList.next(tables);
  }
  sendOptions(options: object) {
    this.tableList.next(options);
  }
  lookupColumns(columns: string[]) {
    let output: { field: string; header: string }[] = [];
    for (let col of columns) {
      output.push(
        this.allColumns.filter((name) => {
          return name.field === col;
        })[0]
      );
    }
    return output;
  }
}
export interface columnDefinition {
  description: string;
  name: string;
  active: boolean;
  filters: string[];
  columnOptions: string[];
  selectedColumns: string[];
}

export interface columnTemplate {
  name: string;
  value: string;
}

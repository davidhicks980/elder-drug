import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Table } from './table-logic/content.component';

@Injectable({
  providedIn: 'root',
})
export class ParametersService {
  constructor() {}
  static receiveTables$: any;
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
        'Recommendation',
        'DiseaseState',
        'DrugInteraction',
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
        'Recommendation',
      ],
      selectedColumns: ['DiseaseState', 'SearchTerm', 'Item', 'Recommendation'],
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
        'Recommendation',
      ],
      selectedColumns: [
        'SearchTerm',
        'Item',
        `MinimumClearance`,
        `MaximumClearance`,
        'Recommendation',
      ],
    },
    {
      description: 'Drug Interactions',
      active: true,
      filters: ['DrugInteraction'],
      name: 'DrugInteraction',
      columnOptions: [
        'SearchTerm',
        'Item',
        `DrugInteraction`,
        'Inclusion',
        'Exclusion',
        'Rationale',
        'Recommendation',
      ],
      selectedColumns: [
        `SearchTerm`,
        `Item`,
        `DrugInteraction`,
        `Inclusion`,
        `Exclusion`,
        `Recommendation`,
      ],
    },
  ];
  // Observable string sources
  private tableList = new Subject<object>();
  private optionsList = new Subject<object>();

  private name = 'ParametersService';

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
  filterActiveTables(tables: Table[]) {
    const output: string[] = [];
    for (const [key, value] of Object.entries(tables)) {
      const len = value.length;
      if (len > 0) {
        output.push(key);
      }
    }
    return output;
  }

  // Service message commands

  lookupColumns(columns: string[]) {
    const output: { field: string; header: string }[] = [];
    for (const col of columns) {
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

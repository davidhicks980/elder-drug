import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ParametersService {
  public columnDefinitions: columnDefinition[] = [
    {
      description: 'General Info',
      active: true,
      filters: [null],
      name: 'full',
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
      name: 'disease',
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
      name: 'clearance',
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
      name: 'interactions',
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
        `Interaction`,
        `Inclusion`,
        `Exclusion`,
        `Recommendation`,
      ],
    },
  ];
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
}
export interface columnDefinition {
  description: string;
  name: string;
  active: boolean;
  filters: string[];
  columnOptions: string[];
  selectedColumns: string[];
}

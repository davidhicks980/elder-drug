import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ParametersService {
  constructor() {}

  public getTableInfo(tables) {
    let array = [];
    for (let table of tables) {
      array.push(this.parametersList.find(({ name }) => name == table));
    }
    return array;
  }

  mapData(data: any[], filter?: string[]) {
    let filteredArray = [];
    let output;
    if (filter[0] != null || filter[1] != null) {
      data.forEach((element) => {
        if (
          element[String(filter[0])] != null ||
          element[String(filter[1])] != null
        ) {
          filteredArray.push(element);
        }
      });
      output = filteredArray;
    } else {
      output = data;
    }
    return output;
  }
  parametersList: TableParameters[] = [
    {
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
      filters: [null, null],
    },
    {
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
      filters: ['DiseaseState', null],
    },
    {
      name: 'clearance',
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
      filters: ['MinimumClearance', 'MaximumClearance'],
    },
    {
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
      filters: ['Interaction', null],
    },
  ];
}
export interface TableParameters {
  toggleOptions?: string[];
  name: string;
  columnOptions: string[];
  selectedColumns: string[];
  filters: string[];
  data?: any;
}

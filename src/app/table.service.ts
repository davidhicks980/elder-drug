import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  private tableStatusSource = new ReplaySubject<number[]>(3);
  tableStatus$ = this.tableStatusSource.asObservable();
  emitSelectedTables(selections: number[]) {
    this.tableStatusSource.next(selections);
  }
  get tables() {
    return this._tables;
  }
  private readonly _tables = [
    {
      TableNumber: 1,
      TableDefinition: 'General Information for Each Table',
      ShortName: 'General Info',
      Identifier: 'Info',
      TableIconName: 'general-health',
      Description: 'A collection of all queried drugs.',
    },
    {
      TableNumber: 2,
      TableDefinition:
        'Potentially Inappropriate Medication Use in Older Adults ',
      ShortName: 'Potentially Innappropriate',
      Identifier: 'Innappropriate',
    },
    {
      TableNumber: 3,
      TableDefinition:
        'Potentially Inappropriate Medication Use in Older Adults Due to Drug-Disease or Drug-Syndrome Interactions That May Exacerbate the Disease or Syndrome',
      ShortName: 'Disease Specific',
      Identifier: 'DiseaseGuidance',
      TableIconName: 'heart-ekg',
      Description: 'Drugs affecting those with specific diseases.',
    },
    {
      TableNumber: 4,
      TableDefinition: 'Drugs To Be Used With Caution in Older Adults',
      ShortName: 'Use with Caution',
      Identifier: 'Caution',
    },
    {
      TableNumber: 5,
      TableDefinition:
        'Potentially Clinically Important Drug-Drug Interactions That Should Be Avoided in Older Adults',
      ShortName: 'Drug Interactions',
      Identifier: 'DrugInteractions',
      TableIconName: 'capsule',
      Description: 'Concerning drug interactions in those 65+',
    },
    {
      TableNumber: 6,
      TableDefinition:
        'Medications That Should Be Avoided or Have Their Dosage Reduced With Varying Levels of Kidney Function in Older Adults',
      ShortName: 'Renal Interactions',
      Identifier: 'Clearance',
      TableIconName: 'kidneys',
      Description: 'Toxic drugs in reduced kidney function',
    },
    {
      TableNumber: 7,
      TableDefinition: 'Drugs With Strong Anticholinergic Properties',
      ShortName: 'Anticholinergics',
      Identifier: 'Anticholinergics',
    },
  ];
  constructor() {}
}

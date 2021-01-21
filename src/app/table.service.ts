import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  private tableStatusSource = new ReplaySubject<Table[]>(3);
  tableStatus$ = this.tableStatusSource.asObservable();
  private pageSource = new ReplaySubject<number>(1);
  pageSource$ = this.pageSource.asObservable();

  emitSelectedTables(selections: number[]) {
    this.tableStatusSource.next(
      this._tables.filter((table) => selections.includes(table.TableNumber))
    );
  }
  emitCurrentPage(page: number) {
    this.pageSource.next(page);
  }
  get tables(): Table[] {
    return this._tables;
  }
  private readonly _tables = [
    {
      TableNumber: 1,
      TableDefinition: 'General Information for Each Table',
      ShortName: 'General',
      Identifier: 'Info',
      TableIconName: 'general-health',
      Description: 'A collection of all queried drugs.',
    },
    {
      TableNumber: 2,
      TableDefinition:
        'Potentially Inappropriate Medication Use in Older Adults ',
      ShortName: 'Potentially Inappropriate',
      Identifier: 'Inappropriate',
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
  ] as Table[];
  constructor() {}
}

export interface Table {
  TableNumber: number;
  TableDefinition: string;
  ShortName: string;
  Identifier: string;
  TableIconName?: string;
  Description?: string;
}

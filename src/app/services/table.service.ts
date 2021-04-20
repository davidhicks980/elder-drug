import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  private tableStatusSource = new ReplaySubject<Table[]>(3);
  tableStatus$ = this.tableStatusSource.asObservable();
  private pageSource = new ReplaySubject<number>(1);
  currentPage$ = this.pageSource.asObservable();
  private descriptionSource = new Subject();
  tableDescription$ = this.descriptionSource.asObservable();
  private titleSource = new Subject();
  tableTitle$ = this.titleSource.asObservable();

  emitSelectedTables(selections: number[]) {
    this.tableStatusSource.next(
      this._tables.filter((table) => selections.includes(table.TableNumber))
    );
  }

  emitCurrentPage(page: number) {
    this.pageSource.next(page);
    this.emitTableInformation(page);
  }
  emitTableInformation(page: number) {
    let information = this.tables.filter(
      (table) => table.TableNumber === page
    )[0];

    this.descriptionSource.next(information.Description);
    this.titleSource.next(information.ShortName);
  }
  get tables(): Table[] {
    return this._tables;
  }
  private readonly _tables = [
    {
      TableNumber: 1,
      FullTitle: 'General Information for Each Table',
      ShortName: 'All Results',
      Identifier: 'Info',
      TableIconName: 'general-health',
      Description: 'Information encompassing all categories of Beers Criteria',
    },
    {
      TableNumber: 2,
      FullTitle: 'Potentially Inappropriate Medication Use in Older Adults ',
      ShortName: 'Inappropriate Medications in Older Adults',
      Identifier: 'Inappropriate',
    },
    {
      TableNumber: 3,
      FullTitle:
        'Potentially Inappropriate Medication Use in Older Adults Due to Drug-Disease or Drug-Syndrome Interactions That May Exacerbate the Disease or Syndrome',
      ShortName: 'Disease Interactions',
      Identifier: 'DiseaseGuidance',
      TableIconName: 'heart-ekg',
      Description:
        'The Disease Guidance table contains drugs that should be avoided in those with a specific disease.',
    },
    {
      TableNumber: 4,
      FullTitle: 'Drugs To Be Used With Caution in Older Adults',
      ShortName: 'Use with Caution',
      Identifier: 'Caution',
    },
    {
      TableNumber: 5,
      FullTitle:
        'Potentially Clinically Important Drug-Drug Interactions That Should Be Avoided in Older Adults',
      ShortName: 'Drug Interactions',
      Identifier: 'DrugInteractions',
      TableIconName: 'capsule',
      Description:
        'The Drug Interactions table contains concerning drug interactions specific to those over the age of 65. It does not include all drug interactions.',
    },
    {
      TableNumber: 6,
      FullTitle:
        'Medications That Should Be Avoided or Have Their Dosage Reduced With Varying Levels of Kidney Function in Older Adults',
      ShortName: 'Renal Interactions',
      Identifier: 'Clearance',
      TableIconName: 'kidneys',
      Description:
        'The Renal Interactions table contains drugs that can be toxic in geriatric patients with reduced kidney function.',
    },
    {
      TableNumber: 7,
      FullTitle: 'Drugs With Strong Anticholinergic Properties',
      ShortName: 'Anticholinergics',
      Identifier: 'Anticholinergics',
    },
  ] as Table[];
  constructor() {}
}

export interface Table {
  TableNumber: number;
  FullTitle: string;
  ShortName: string;
  Identifier: string;
  TableIconName?: string;
  Description?: string;
}

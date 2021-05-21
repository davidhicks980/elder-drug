import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ColumnService {
  fields: ColumnField[];
  constructor() {}

  static receiveTables$: any;

  public columnOptions = [
    {
      field: ColumnField.EntryID,
      description: 'Entry',
      header: 'Entry Number',
    },
    {
      field: ColumnField.DiseaseState,
      description: 'Caution in',
      header: 'Disease State',
    },
    {
      field: ColumnField.Category,
      description: 'Category',
      header: 'Category Number',
    },
    {
      field: ColumnField.TableDefinition,
      description: 'TableDefinition',
      header: 'Table Definition',
    },
    { field: ColumnField.Item, description: 'Item', header: 'Item' },
    {
      field: ColumnField.MinimumClearance,
      description: 'Avoid in clearance below',
      header: 'Min Clearance',
    },
    {
      field: ColumnField.MaximumClearance,
      description: 'Avoid in clearance above',
      header: 'Max Clearance',
    },
    {
      field: ColumnField.DrugInteraction,
      description: 'Interacts with',
      header: 'Drug Interaction',
    },
    {
      field: ColumnField.Inclusion,
      description: 'Applies to',
      header: 'Includes',
    },
    {
      field: ColumnField.Exclusion,
      description: 'Does not apply to',
      header: 'Excludes',
    },
    {
      field: ColumnField.Rationale,
      description: 'Rationale',
      header: 'Rationale',
    },
    {
      field: ColumnField.Recommendation,
      description: 'Recommendation',
      header: 'Recommendation',
    },

    {
      field: ColumnField.ShortName,
      description: 'Table Name #',
      header: 'Table',
    },
    {
      field: ColumnField.SearchTerms,
      description: 'Searches',
      header: 'Search Term',
    },
  ];

  public columnDefinitions: TableDefinition[] = [
    {
      description: 'General Info',
      filters: [null],
      id: Category.General,
      columnOptions: [
        { id: ColumnField.SearchTerms, selected: true },
        { id: ColumnField.Item, selected: true },
        { id: ColumnField.Exclusion, selected: true },
        { id: ColumnField.Inclusion, selected: true },
        { id: ColumnField.Recommendation, selected: true },
        { id: ColumnField.DiseaseState, selected: true },
        { id: ColumnField.DrugInteraction, selected: false },
        { id: ColumnField.ShortName, selected: true },
      ],
    },
    {
      description: 'Disease-Specific',
      filters: [ColumnField.DiseaseState],
      id: Category.DiseaseGuidance,
      columnOptions: [
        { id: ColumnField.SearchTerms, selected: true },
        { id: ColumnField.Item, selected: true },
        { id: ColumnField.Exclusion, selected: true },
        { id: ColumnField.Inclusion, selected: true },
        { id: ColumnField.Recommendation, selected: false },
        { id: ColumnField.DiseaseState, selected: true },
      ],
    },
    {
      description: 'Renal Interactions',
      id: Category.RenalEffect,
      filters: [ColumnField.MaximumClearance, ColumnField.MinimumClearance],
      columnOptions: [
        { id: ColumnField.SearchTerms, selected: true },
        { id: ColumnField.Item, selected: true },
        { id: ColumnField.MinimumClearance, selected: true },
        { id: ColumnField.MaximumClearance, selected: true },
        { id: ColumnField.Inclusion, selected: false },
        { id: ColumnField.Exclusion, selected: false },
        { id: ColumnField.Recommendation, selected: true },
      ],
    },
    {
      description: 'Drug Interactions',
      filters: [ColumnField.DrugInteraction],
      id: Category.DrugInteractions,
      columnOptions: [
        { id: ColumnField.SearchTerms, selected: true },
        { id: ColumnField.Item, selected: true },
        { id: ColumnField.DrugInteraction, selected: true },
        { id: ColumnField.Inclusion, selected: true },
        { id: ColumnField.Exclusion, selected: true },
        { id: ColumnField.Recommendation, selected: true },
        { id: ColumnField.Rationale, selected: false },
      ],
    },
  ];
  // Observable string sources
  private columnsSource = new Subject<DisplayedColumns[]>();
  private activeColumnsSource = new Subject<string[]>();

  private _descriptionMap = new Map(
    this.columnOptions.map((col) => [col.field, col.description])
  );
  tables = new Set(this.columnDefinitions.map((def) => def.filters).flat());

  // Observable string streams
  observeColumns$ = this.columnsSource.asObservable();
  observeActiveColumns$ = this.activeColumnsSource.asObservable();

  lookupDescription(column: ColumnField) {
    try {
      this._descriptionMap.get(column);
    } catch (err) {
      return column;
    }
  }
  triggerColumnChange(table: Category) {
    const allColumns = this.columnDefinitions
      .filter((column) => column.id === table)
      .map((column) => column.columnOptions)[0];
    this.columnsSource.next(allColumns);
    this.activeColumnsSource.next(
      allColumns.filter((col) => col.selected).map((col) => col.id)
    );
  }
  updateSelectedColumns(selected: string[]) {
    this.activeColumnsSource.next(selected);
  }
  tableExists(table): boolean {
    return this.tables.has(table);
  }
  retrieveTable(item) {
    return this.columnDefinitions
      .filter((def) => def.filters.includes(item))
      .map((def) => def.id)[0];
  }
}

export interface DisplayedColumns {
  id: ColumnField;
  selected: boolean;
}

export interface TableDefinition {
  description: string;
  id: number;
  filters: ColumnField[];
  columnOptions: DisplayedColumns[];
}

export interface columnTemplate {
  name: string;
  value: string;
}
export type ColumnInfo = {
  field: ColumnField;
  header: string;
};
export enum ColumnField {
  EntryID = 'EntryID',
  DiseaseState = 'DiseaseState',
  Category = 'Category',
  TableDefinition = 'TableDefinition',
  Item = 'Item',
  MinimumClearance = 'MinimumClearance',
  MaximumClearance = 'MaximumClearance',
  DrugInteraction = 'DrugInteraction',
  Inclusion = 'Inclusion',
  Exclusion = 'Exclusion',
  Rationale = 'Rationale',
  Recommendation = 'Recommendation',
  RecommendationLineTwo = 'RecommendationLineTwo',
  ShortName = 'ShortName',
  SearchTerms = 'SearchTerms',
}

export enum Category {
  General = 1,
  PotentiallyInnappropriate,
  DiseaseGuidance,
  Caution,
  DrugInteractions,
  RenalEffect,
  Anticholinergics,
}

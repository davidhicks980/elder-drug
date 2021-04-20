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
    { field: 'EntryID', header: 'Entry Number' },
    { field: 'DiseaseState', header: 'Disease State' },
    { field: 'Category', header: 'Category Number' },
    { field: 'TableDefinition', header: 'Table Definition' },
    { field: 'MatchedBeersEntry', header: 'Item' },
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

  public columnDefinitions: TableDefinition[] = [
    {
      description: 'General Info',
      filters: [null],
      id: Category.General,
      columnOptions: [
        { id: ColumnField.SearchTerm, selected: true },
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
        { id: ColumnField.SearchTerm, selected: true },
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
        { id: ColumnField.SearchTerm, selected: true },
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
        { id: ColumnField.SearchTerm, selected: true },
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

  tables = new Set(this.columnDefinitions.map((def) => def.filters).flat());

  // Observable string streams
  observeColumns$ = this.columnsSource.asObservable();
  observeActiveColumns$ = this.activeColumnsSource.asObservable();

  triggerColumnChange(table: Category) {
    const activeColumns = this.columnDefinitions
      .filter((column) => column.id === table)
      .map((column) => column.columnOptions)[0];
    this.columnsSource.next(activeColumns);
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
  SearchTerm = 'SearchTerm',
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

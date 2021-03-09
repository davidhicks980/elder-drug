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
  private tableColumns = new Subject<DisplayedColumns>();
  private optionsList = new Subject<object>();
  tables = new Set(this.columnDefinitions.map((def) => def.filters).flat());

  // Observable string streams
  recieveTableColumns$ = this.tableColumns.asObservable();
  requestTable(table: Category) {
    const options = this.columnDefinitions.filter(
      (columns) => columns.id === table
    )[0].columnOptions;
    const selectedFields = options
      .filter((item) => item.selected)
      .map((item) => item.id);
    const allFields = options.map((item) => item.id);
    this.tableColumns.next({ selected: selectedFields, all: allFields });
  }

  tableExists(table): boolean {
    console.log(table);
    return this.tables.has(table);
  }
  retrieveTable(item) {
    return this.columnDefinitions
      .filter((def) => def.filters.includes(item))
      .map((def) => def.id)[0];
  }
}

export interface DisplayedColumns {
  selected: ColumnField[];
  all: ColumnField[];
}
export interface TableDefinition {
  description: string;
  id: number;
  filters: ColumnField[];
  columnOptions: { id: ColumnField; selected: boolean }[];
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

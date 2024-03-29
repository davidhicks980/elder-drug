import { InjectionToken } from '@angular/core';

import { ColumnField } from '../enums/ColumnFields';
import { TableCategories } from '../enums/TableCategories.enum';
import { TableConfig } from '../interfaces/TableConfig';

export const tableConfig: TableConfig[] = [
  {
    description: 'General Info',
    filters: [],
    id: TableCategories.General,
    columnOptions: [
      { id: ColumnField.SearchTerms, selected: true },
      { id: ColumnField.ShortName, selected: true },
      { id: ColumnField.Item, selected: true },
      { id: ColumnField.Exclusion, selected: false },
      { id: ColumnField.Inclusion, selected: false },
      { id: ColumnField.Recommendation, selected: true },
      { id: ColumnField.DiseaseState, selected: false },
      { id: ColumnField.DrugInteraction, selected: false },
      { id: ColumnField.Rationale, selected: false },
    ],
  },
  {
    description: 'Disease-Specific',
    filters: [ColumnField.DiseaseState],
    id: TableCategories.DiseaseGuidance,
    columnOptions: [
      { id: ColumnField.DiseaseState, selected: true },
      { id: ColumnField.SearchTerms, selected: true },
      { id: ColumnField.Item, selected: true },
      { id: ColumnField.Exclusion, selected: false },
      { id: ColumnField.Inclusion, selected: false },
      { id: ColumnField.Recommendation, selected: true },
      { id: ColumnField.Rationale, selected: false },
    ],
  },
  {
    description: 'Renal Interactions',
    id: TableCategories.RenalEffect,
    filters: [ColumnField.MaximumClearance, ColumnField.MinimumClearance],
    columnOptions: [
      { id: ColumnField.SearchTerms, selected: false },
      { id: ColumnField.Item, selected: true },
      { id: ColumnField.MinimumClearance, selected: true },
      { id: ColumnField.MaximumClearance, selected: true },
      { id: ColumnField.Inclusion, selected: false },
      { id: ColumnField.Exclusion, selected: false },
      { id: ColumnField.Recommendation, selected: true },
      { id: ColumnField.Rationale, selected: true },
    ],
  },
  {
    description: 'Drug Interactions',
    filters: [ColumnField.DrugInteraction],
    id: TableCategories.DrugInteractions,
    columnOptions: [
      { id: ColumnField.SearchTerms, selected: true },
      { id: ColumnField.Item, selected: true },
      { id: ColumnField.DrugInteraction, selected: true },
      { id: ColumnField.Inclusion, selected: false },
      { id: ColumnField.Exclusion, selected: false },
      { id: ColumnField.Recommendation, selected: true },
      { id: ColumnField.Rationale, selected: false },
    ],
  },
];

export const TABLE_CONFIG = new InjectionToken<TableConfig[]>('tables.config');

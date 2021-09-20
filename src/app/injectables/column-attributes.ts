import { InjectionToken } from '@angular/core';

import { ColumnField } from '../enums/ColumnFields';
import { ColumnAttributes } from '../interfaces/ColumnAttributes';

export const columnList: ColumnAttributes[] = [
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

export const COLUMN_ATTRIBUTES = new InjectionToken<ColumnAttributes[]>(
  'columns.attributes'
);

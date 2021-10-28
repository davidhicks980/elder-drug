import { InjectionToken } from '@angular/core';

import { ColumnField } from '../enums/ColumnFields';
import { ColumnAttributes } from '../interfaces/ColumnAttributes';

export const columnList: ColumnAttributes[] = [
  {
    field: ColumnField.EntryID,
    header: 'Entry Number',
  },
  {
    field: ColumnField.DiseaseState,
    header: 'Disease State',
  },
  {
    field: ColumnField.Category,
    header: 'Category Number',
  },
  {
    field: ColumnField.TableDefinition,
    header: 'Table Definition',
  },
  { field: ColumnField.Item, header: 'Item' },
  {
    field: ColumnField.MinimumClearance,
    header: 'Minimum Clearance',
  },
  {
    field: ColumnField.MaximumClearance,
    header: 'Maximum Clearance',
  },
  {
    field: ColumnField.DrugInteraction,
    header: 'Drug Interaction',
  },
  {
    field: ColumnField.Inclusion,
    header: 'Applicable to',
  },
  {
    field: ColumnField.Exclusion,
    header: 'Not applicable to',
  },
  {
    field: ColumnField.Rationale,
    header: 'Rationale',
  },
  {
    field: ColumnField.Recommendation,
    header: 'Recommendation',
  },

  {
    field: ColumnField.ShortName,
    header: 'Table',
  },
  {
    field: ColumnField.SearchTerms,
    header: 'Search Term',
  },
];

export const COLUMN_ATTRIBUTES = new InjectionToken<ColumnAttributes[]>('columns.attributes');

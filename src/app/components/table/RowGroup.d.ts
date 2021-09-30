import { RowExpansionMixin } from './RowExpansionMixin';

export interface RowGroup<T> {
  field: string;
  groupHeader: string;
  rows: T[];
  position: RowExpansionMixin;
}
export type FlatRowGroup<T> = Omit<RowGroup<T>, 'rows'>;

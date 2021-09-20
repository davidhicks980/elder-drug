import { RowExpansionMixin } from './RowExpansionMixin';
import { TableEntry } from './TableEntry';

export interface RowGroup<T> {
  field: string;
  groupHeader: string;
  rows: (TableEntry<T> | RowGroup<T>)[];
  _position: RowExpansionMixin;
}
export type FlatRowGroup<T> = Omit<RowGroup<T>, 'rows'>;

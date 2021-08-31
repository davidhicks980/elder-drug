import { Entries } from './Entries';
import { RowExpansionMixin } from './RowExpansionMixin';

export interface RowGroup {
  field: string;
  groupHeader: string;
  rows: Entries[];
  _position: RowExpansionMixin;
}

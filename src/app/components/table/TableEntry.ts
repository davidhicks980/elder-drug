import { RowExpansionMixin } from './RowExpansionMixin';

export type TableEntry<T> = T & { _position: RowExpansionMixin };

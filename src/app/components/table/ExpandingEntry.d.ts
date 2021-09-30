import { BeersField } from '../../interfaces/BeersField';
import { RowExpansionMixin } from './RowExpansionMixin';
import { RowGroup } from './RowGroup';

export type ExpandingEntry = { position: RowExpansionMixin; fields: BeersField };
export type ExpandingGroup = RowGroup<unknown>;

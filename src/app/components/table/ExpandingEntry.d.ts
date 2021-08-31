import { BeersField } from '../../services/data.service';
import { RowExpansionMixin } from './RowExpansionMixin';
import { RowGroup } from './RowGroup';

export type ExpandingEntry = BeersField & { _position: RowExpansionMixin };
export type ExpandingGroup = RowGroup;

import { ColumnField } from '../enums/ColumnFields';
import { DisplayedColumns } from './DisplayedColumns';

export interface TableConfig {
  description: string;
  id: number;
  filters: ColumnField[];
  columnOptions: DisplayedColumns[];
}

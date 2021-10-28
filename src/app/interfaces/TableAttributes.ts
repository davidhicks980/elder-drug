import { TableCategories } from '../enums/TableCategories.enum';

export interface TableAttributes {
  tableNumber: TableCategories;
  fullTitle: string;
  shortName: string;
  identifier: string;
  tableIcon?: string;
  description?: string;
}

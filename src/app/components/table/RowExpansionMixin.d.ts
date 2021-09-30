export interface RowExpansionMixin {
  id: string;
  parentId: string;
  isGroup: boolean;
  hasParent: boolean;
  hash?: string;
  expanded?: boolean;
}

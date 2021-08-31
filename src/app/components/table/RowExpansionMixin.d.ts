export interface RowExpansionMixin {
  parentExpanded: boolean;
  layer: number;
  root: number;
  index: number;
  ////////////////
  id: string;
  parentId: string;
  ///////////////
  isGroup: boolean;
  hasParent: boolean;
  ///////////////
  hash?: string;
  expanded?: boolean;
}

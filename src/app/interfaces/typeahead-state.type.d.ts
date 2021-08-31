export interface TypeaheadState {
  pending: boolean;
  open: boolean;
  data: string[][];
  length: number;
  edit: boolean;
}

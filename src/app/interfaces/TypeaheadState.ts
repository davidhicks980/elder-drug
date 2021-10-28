import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

export interface TypeaheadState {
  pending: boolean;
  open: boolean;
  data: string[][];
  length: number;
  edit: boolean;
  trigger?: MatAutocompleteTrigger;
}

import { Validators } from '@angular/forms';

export const SEARCH_VALIDATORS = [
  Validators.pattern('[\\w.\\s-]*'),
  Validators.required,
  Validators.minLength(2),
  Validators.maxLength(70),
];

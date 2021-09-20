import { InjectionToken } from '@angular/core';

import generics from '../../assets/generics-lookup.json';

export const genericDrugNames: Record<string, string[]> = generics.drugNames;
export const GENERIC_DRUGS = new InjectionToken<Record<string, string[]>>(
  'generic.drugNames'
);

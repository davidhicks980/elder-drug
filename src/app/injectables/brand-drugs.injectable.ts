import { InjectionToken } from '@angular/core';

import entries from '../../assets/beers-entries.json';
import { BeersEntry } from '../interfaces/BeersEntry';

export const beersEntries: BeersEntry[] = entries.beersEntries;
export const BEERS_ENTRIES = new InjectionToken<BeersEntry[]>('BeersEntries');

import { Location } from '@angular/common';
import { Inject, Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, switchMap, switchMapTo, take } from 'rxjs/operators';

import { GENERIC_DRUGS } from '../injectables/generic-drugs.injectable';
import { BeersEntry } from '../interfaces/BeersEntry';
import { DataService } from './data.service';

export type BeersSearchResult = BeersEntry & {
  SearchTerms: string;
};
export interface SearchResult<T> {
  results: T[];
  terms: string[];
  timestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  /**
   * Used to quickly validate inputs when checking whether a drug exists in the drug database
   *
   * @private
   * @type {Set<string>}
   * @memberof SearchService
   */
  private drugs: Set<string> = new Set();
  private drugIndex: Map<string, string[]> = new Map();
  private historySource: BehaviorSubject<string[]> = new BehaviorSubject([]);
  private searchResultsSource: BehaviorSubject<SearchResult<BeersSearchResult>> =
    new BehaviorSubject({
      results: [],
      timestamp: -1,
      terms: [],
    });
  readonly searchResults$ = this.searchResultsSource.asObservable();
  private drugEntryMapping: Map<string, number[]> = new Map();
  history$ = this.historySource.asObservable().pipe(
    distinctUntilChanged((prev, next) => {
      return prev.length === next.length && next.every((value) => prev.includes(value));
    })
  );
  get history() {
    return this.historySource.value.slice();
  }
  get searchResults(): SearchResult<BeersSearchResult> {
    let search = { ...this.searchResultsSource.value },
      results = search.results.map((row) => ({ ...row })),
      timestamp = search.timestamp,
      terms = search.terms;
    return { results, timestamp, terms };
  }
  storeHistory(drugs: string[]) {
    this.historySource.next(this.validateAndFormatSearch(drugs));
  }
  searchTerms(terms?: string | string[]) {
    this.routerService.navigate(['/search'], {
      queryParams: {
        drug: Array.isArray(terms) && terms.length ? terms : this.historySource.value,
      },
      replaceUrl: true,
    });
  }

  filterTypeahead(entry: string): string[] {
    if (!this.drugIndex.size) {
      return ['loading'];
    }
    if (entry && typeof entry === 'string') {
      let letter = entry.charAt(0).toLowerCase();
      if (/([a-z])/.test(letter)) {
        return this.drugIndex
          .get(letter)
          .filter((val) => val.startsWith(entry))
          .slice(0, 10);
      } else {
        return [];
      }
    } else {
      throw TypeError('Typeahead can only process strings');
    }
  }
  /**
   * Used to provide input validation within the search form.
   *
   * @param {string} drug
   * @returns {*}  {boolean}
   * @memberof SearchService
   */
  validateDrugExists(drug: string): boolean {
    return this.drugs.has(drug);
  }
  private validateAndFormatSearch(drugs: string[] | string): string[] {
    if (typeof drugs === 'string') {
      drugs = [drugs as string];
    }
    if (Array.isArray(drugs)) {
      if (!drugs.length) return [];
      let isWord = /[\w\s\,\_.\+\$]+/;
      return drugs
        .slice()
        .map((drug) => String(drug).toLowerCase())
        .filter((drug) => isWord.test(drug) && this.drugs.has(drug));
    } else {
      console.error('Provided drugs are not formatted correctly');
    }
  }
  /**
   * Creates an array containing the English alphabet.
   *
   * @usage Used to create a fast drug index in combination with createDrugIndex. Drugs containing the first letter is looked up when the user starts typing, which substantially improves speed.
   * @private
   * @returns {string[]} Array sorted in alphabetical order
   * @memberof SearchService
   */
  private getAlphabet(): string[] {
    return Array.from({ length: 26 }, (_, i) => (i + 10).toString(36));
  }
  /**
   * Map used to quickly look up drugs based on the first letter of the drug name.
   *
   *
   *
   * @private
   * @param {string[]} drugs
   * @returns {*}  ```
   * Map<letter, drugName[]>
   * ```
   * @memberof SearchService
   */
  private indexDrugs(drugs: string[]): Map<string, string[]> {
    return new Map(
      this.getAlphabet().map((letter) => {
        return [letter, drugs.filter((drug) => drug.startsWith(letter))];
      })
    );
  }
  /**
   * Append ~g to generic drugs and ~b to brand drugs. Appendages are used to distinguish the type of chip a drug recieves within the typeahead popup
   * @private
   * @param {string[]} drugList
   * @returns {string[]} formatted drug array
   * @memberof SearchService
   */
  private markDrugBrandOrGeneric(drugList: string[]): string[] {
    let generics = {};
    Object.keys(this.genericIndex).forEach((letter) => {
      generics[letter] = this.genericIndex[letter].map((drug) => {
        return drug?.toLowerCase();
      });
    });
    return drugList.map((drug) => {
      return drug.concat(generics[drug[0]].includes(drug) ? '~g' : '~b');
    });
  }

  private search(terms: string[]): void {
    let drugs = this.validateAndFormatSearch(terms);
    this.historySource.next(drugs);
    if (drugs?.length) {
      let results: Map<number, BeersSearchResult> = new Map(),
        indices = [],
        entry = {};
      for (let drug of drugs) {
        indices = this.drugEntryMapping.get(drug);
        for (let index of indices) {
          if (!results.has(index)) {
            entry = this.dataService.drugEntries.get(index) || {};
            results.set(index, { ...entry, SearchTerms: drug });
          } else {
            results.get(index).SearchTerms = results.get(index).SearchTerms + `, ${drug}`;
          }
        }
      }
      this.searchResultsSource.next({
        terms: drugs,
        results: Array.from(results.values()),
        timestamp: Date.now(),
      });
    }
  }

  private formatDrugKey(key: string) {
    return key.replace(/\+/gi, ' ').toLowerCase();
  }

  private createDrugEntryMapping(list: Record<string, number[]>) {
    return new Map(Object.entries(list).map(([k, v]) => [this.formatDrugKey(k), v]));
  }

  constructor(
    private dataService: DataService,
    @Inject(GENERIC_DRUGS) private genericIndex: Record<string, string[]>,
    //I use the location service because the router service is overkill for an application as simple as Elder Drug
    private route: ActivatedRoute,
    private routerService: Router
  ) {
    this.dataService.drugList$.subscribe((drugs) => {
      this.drugs = new Set(drugs);
      const markedDrugs = this.markDrugBrandOrGeneric(drugs);
      this.drugIndex = this.indexDrugs(markedDrugs);
    });
    this.dataService.entriesMappedToTables$.subscribe((entries) => {
      this.drugEntryMapping = this.createDrugEntryMapping(entries);
    });

    this.dataService.dataAcquired$
      .pipe(take(1), switchMapTo(this.route.queryParams))
      .subscribe((params: { drug?: string[] }) => {
        if (params?.drug) {
          this.search(params.drug);
        }
      });
  }
}

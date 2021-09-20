import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { GENERIC_DRUGS } from '../injectables/generic-drugs.injectable';
import { BeersEntry } from '../interfaces/BeersEntry';
import { DataService } from './data.service';

export type BeersSearchResult = BeersEntry & {
  SearchTerms: string;
};
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
  private drugs: Set<string>;
  private drugIndex: Map<string, string[]>;
  private historySource: BehaviorSubject<string[]> = new BehaviorSubject([]);
  private searchResultsSource: BehaviorSubject<BeersSearchResult[]> =
    new BehaviorSubject([]);
  drugMap: Map<string, number[]>;
  get searchResults$() {
    return this.searchResultsSource.asObservable();
  }
  get searchResults() {
    return this.searchResultsSource.getValue();
  }
  storeHistory(drugs: string[]) {
    this.historySource.next(this.validateAndFormatSearch(drugs));
  }
  filterTypeahead(entry: string) {
    if (entry && typeof entry === 'string') {
      entry = entry.toLowerCase();
      return this.drugIndex
        .get(entry[0])
        .filter((val) => val.startsWith(entry))
        .slice(0, 10);
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
      return drugs
        .map((drug) => drug.toLowerCase())
        .filter((drug) => {
          return (
            typeof drug === 'string' &&
            /[\w\s\,\_.\+\$]+/.test(drug) &&
            this.drugs.has(drug)
          );
        });
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
    return Array(26)
      .fill('a')
      .map((_, i) => (i + 10).toString(36));
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
    return drugList.map((drug) =>
      drug + this.genericIndex[drug[0]].includes(drug) ? '~g' : '~b'
    );
  }
  get lastSearch() {
    return this.historySource.getValue();
  }

  searchDrugs(terms?: string | string[]) {
    //If there are no terms being searched, take the latest term from history.
    //Search history has already been validated and formatted
    let drugs = this.validateAndFormatSearch(terms) || this.historySource.value;

    if (drugs?.length) {
      let results: Map<number, BeersSearchResult> = new Map(),
        term = '',
        index = 0,
        indices = [],
        entry = {};
      while (drugs?.length) {
        term = drugs.pop();
        indices = this.drugMap.get(term) || [];
        while (indices?.length) {
          index = indices.pop();
          if (!results.has(index)) {
            entry = this.dataService.beersMap.get(index) || {};
            results.set(index, { ...entry, SearchTerms: term });
          } else {
            results.get(index).SearchTerms += `, ${term}`;
          }
        }
      }

      this.searchResultsSource.next(Array.from(results.values()));
    }
  }

  private formatDrugKey(key: string) {
    return key.replace(/\+/gi, ' ').toLowerCase();
  }

  private createDrugMap(list: Record<string, number[]>) {
    return new Map(
      Object.entries(list).map(([k, v]) => [this.formatDrugKey(k), v])
    );
  }
  constructor(
    private dataService: DataService,
    @Inject(GENERIC_DRUGS) private genericIndex: Record<string, string[]>
  ) {
    this.dataService.drugList$.toPromise().then((drugs) => {
      this.drugs = new Set(drugs);
      const markedDrugs = this.markDrugBrandOrGeneric(drugs);
      this.drugIndex = this.indexDrugs(markedDrugs);
    });
    this.dataService.entriesMappedToTables$.toPromise().then((entries) => {
      this.createDrugMap(entries);
    });
  }
}

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import * as beers from '../assets/beers-entries.json';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  items: Observable<unknown>;
  beersArray: number[];
  dropdown: Observable<unknown>;
  updatedTables = new Subject<any>();
  queriedTables$ = this.updatedTables.asObservable();
  entryMap: Map<string, number[]> = new Map();
  public groupedTables: Subject<any> = new Subject<any>();
  private queryMap: Map<number, string[]> = new Map();
  dropdownItems: Map<string, string[]>;
  dropdownParameters: any;
  loaded: any;
  beersMap: Map<number, {}> = new Map();
  beersObjects: any = (beers as any).default;

  private makeBeersMap() {
    this.beersObjects.forEach((item) => this.beersMap.set(item.EntryID, item));
  }

  private queryBeers(drugs: number[]) {
    const compiledArray = [];
    console.log(drugs);
    for (const drug of drugs) {
      compiledArray.push(this.beersMap.get(drug));
    }
    return compiledArray;
  }

  private async queryBeersDropdown(fire: any) {
    const reference = await fire
      .collection('dropdown')
      .doc('dropdownItems')
      .ref.get();

    this.ddMap = await reference.data();
    return true;
  }
  searchDrugs(drugs: string[]) {
    const indexArray = [];
    for (const drug of drugs) {
      const indices = this.entryMap.get(drug);
      indexArray.push(...indices);
      for (const index of indices) {
        this.getSearches(index, drug);
      }
    }
    this.emitTables(this.queryBeers(indexArray));
  }
  getSearches(entryID: number, drug: string) {
    if (this.queryMap.has(entryID)) {
      const mappedDrugs = this.queryMap.get(entryID);
      if (!mappedDrugs.includes(drug)) {
        mappedDrugs.push(drug);
        this.queryMap.set(entryID, mappedDrugs);
      }
    } else {
      this.queryMap.set(entryID, [drug]);
    }
  }
  emitTables(tables: any[]) {
    const mappedTerms = this.getUniqueListBy(
      this.mapQueryTerms(tables),
      'EntryID'
    );
    const groupedTables = this.groupTables(mappedTerms);
    this.groupedTables.next(groupedTables);
  }

  mapQueryTerms(tables: {}[]) {
    for (const table of tables) {
      table['SearchTerm'] = this.queryMap.get(table['EntryID']).join(' | ');
    }
    return tables;
  }
  groupTables(tables: BeersEntry[]) {
    const diseaseGuidanceTable = tables.filter((item) => item.Category == 3);
    const drugInteractionTable = tables.filter((item) => item.Category == 5);
    const clearanceTable = tables.filter((item) => item.Category == 6);

    const output = {
      Clearance: clearanceTable,
      DrugInteraction: drugInteractionTable,
      DiseaseGuidance: diseaseGuidanceTable,
      GeneralInfo: tables,
    };
    return output;
  }
  filterValues(entry: string) {
    if (entry.length) {
      const first = entry[0].toLowerCase();
      return this.dropdownItems
        .get(first)
        .filter((val) => val.startsWith(entry.toLowerCase()));
    }
  }
  set ddMap(list: {}) {
    const dropdown = [];
    const indexedObj = new Map();
    let processedItem;
    for (const item in list) {
      processedItem = item.replace(/\+/gi, ' ').toLowerCase();
      dropdown.push(processedItem);
      this.entryMap.set(processedItem, list[item]);
    }
    let i = 0;
    let letter;
    for (i = 0; i < 26; i++) {
      letter = (i + 10).toString(36);
      indexedObj.set(
        letter,
        dropdown.filter((name) => name.startsWith(letter))
      );
    }
    this.dropdownItems = indexedObj;
  }

  getUniqueListBy = (arr, key) => {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }

  constructor(private firestore: AngularFirestore) {
    this.queryBeersDropdown(firestore).then((res) => {
      this.loaded = res;
    });
    this.makeBeersMap();
  }
}

export interface Drug {
  name: string;
  rxnormId: number;
  EntryID: number;
  uri: string;
  brands?: [
    {
      name: string;
      rxcui: number;
    }
  ];
}
export interface BeersEntry {
  EntryID?: number;
  DiseaseState?: string;
  Category?: number;
  Item?: string;
  MinimumClearance?: number;
  MaximumClearance?: number;
  Interaction?: string;
  Inclusion?: string;
  Exclusion?: string;
  Rationale?: string;
  Recommendation?: string;
  RecommendationLineTwo?: string;
  ItemType?: string;
  ShortName?: string;
}

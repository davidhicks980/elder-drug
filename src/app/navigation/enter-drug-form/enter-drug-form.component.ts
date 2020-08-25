import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  ViewChild,
} from '@angular/core';
import { MatInput } from '@angular/material/input';
import { MatSidenav } from '@angular/material/sidenav';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WebsocketService } from '../../websocket.service';
import { StateService } from 'src/app/state.service';
import { AngularFirestore } from '@angular/fire/firestore';
@Component({
  selector: 'app-enter-drug-form',
  templateUrl: './enter-drug-form.component.html',
  styleUrls: ['./enter-drug-form.component.scss'],
})
export class EnterDrugFormComponent implements OnInit {
  @ViewChildren(MatInput) submission: QueryList<MatInput>;
  @ViewChild(MatInput) input: MatInput;
  //@ViewChildren('searchInputs') submission: ElementRef;
  @ViewChild('drawer') public sidenav: MatSidenav;
  showFiller = true;
  newOptions: any;
  filterList: any;
  activeRoot: string;
  sidenavActive: boolean;
  activeString: string;
  public drugs: DrugInput[] = [
    {
      id: 1,
      control: new FormControl(),
    },
  ];

  i: number;
  activeInput: number = 0;
  BrandGenerics: {
    name: string;
    rxnormId: string[];
    EntryID: number;
    uri: string;
    brands: { name: string; rxcui: string }[];
  }[];
  items: any;
  dropdownItems: [any];
  out: any;
  dropdownItemsSearch: any;
  dropdownArray: {};
  filteredOptions: Observable<string[]>;
  entryValue: string;

  addDrug() {
    let index = this.drugs.length + 1;
    if (this.drugs.length <= 30)
      this.drugs.push({ id: index, control: new FormControl() });
    this.activeInput++;
  }

  removeDrug(i: number) {
    if (this.drugs.length > 1) {
      this.drugs.splice(i, 1);
      this.activeInput--;
    }
  }
  boldDropdownText(option: string, active: string) {
    let index = option.search(active);
    let subString = option.substring(index, index + 50);
    return '<p>' + subString.replace(active, active.bold()) + '</p>';
  }
  ConvertToJSON(product: any) {
    return JSON.parse(product);
  }

  getInputString(input: string, inputIndex: number) {
    this.activeString = input;
    this.activeInput = inputIndex;
    if (input.length === 2 || !input.includes(this.activeRoot)) {
      this.activeRoot = input;
    }
  }

  search(entry) {
    let outArray = [];
    let results = entry._results;
    results.forEach((element) => {
      outArray.push(element.value);
    });
    this.stateService.toggleSidenav();
  }

  ngOnInit() {
    this.sidenavActive = this.stateService.sidenavOpen;
  }

  private _filter(value: string): string[] {
    let first = value[0];
    return this.dropdownArray[`${first}`].filter((val) =>
      val.startsWith(value)
    );
  }
  searchIndex(entry: string) {
    this.entryValue = entry;
  }
  setMap(list: {}) {
    let dropdown = [];
    let indexedObj = {};
    for (let item in list) {
      dropdown.push(item.replace(/\+/gi, ' ').toLowerCase());
    }

    let i = 0;
    for (i = 0; i < 26; i++) {
      let letter = (i + 10).toString(36);
      indexedObj[letter] = dropdown.filter((name) => name.startsWith(letter));
    }
    this.dropdownArray = indexedObj;
  }
  constructor(
    public webSocketService: WebsocketService,
    public stateService: StateService,
    public firestore: AngularFirestore
  ) {
    this.items = firestore
      .collection('dropdown')
      .doc('dropdownItems')
      .valueChanges();
    this.items.subscribe((data: any): void => this.setMap(data));
    this.filteredOptions = this.drugs[
      this.activeInput
    ].control.valueChanges.pipe(
      map(() => {
        if (this.entryValue) {
          return this._filter(this.entryValue).sort();
        }
      })
    );
  }
}
export interface DrugInput {
  id: number;
  control: FormControl;
}

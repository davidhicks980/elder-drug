import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatInput } from '@angular/material/input';
import { MatSidenav } from '@angular/material/sidenav';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { WebsocketService } from '../../websocket.service';
import { map } from 'rxjs/operators';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { StateService } from 'src/app/state.service';

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
  control = new FormControl();
  newOptions: any;
  filterList: any;
  filteredOptions: Observable<string[]>;
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
  activeInput: number;

  addDrug() {
    let index = this.drugs.length + 1;
    if (this.drugs.length <= 30)
      this.drugs.push({ id: index, control: new FormControl() });
  }

  removeDrug(i: number) {
    if (this.drugs.length > 1) {
      this.drugs.splice(i, 1);
    }
  }
  boldDropdownText(option: string, active: string) {
    let index = option.search(active);
    let subString = option.substring(index - 40, index + 50);
    return '<p>' + subString.replace(active, active.bold()) + '</p>';
  }
  private _filter(value: string, data: any): string[] {
    if (value.length > 2) {
      const filterValue = value.toLowerCase();
      return data.filter((option: any) => {
        let optionString = JSON.stringify(option);
        return optionString.includes(filterValue);
      });
    }
  }
  ConvertToJSON(product: any) {
    return JSON.parse(product);
  }

  getInputString(input: string, inputIndex: number) {
    this.activeString = input;
    this.activeInput = inputIndex;
    if (input.length === 2 || !input.includes(this.activeRoot)) {
      this.webSocketService.emit('drugs-to-filter', input);
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
    this.webSocketService.emit('drugs-to-search', outArray);
  }

  ngOnInit() {
    this.sidenavActive = this.stateService.sidenavOpen;
  }

  constructor(
    public webSocketService: WebsocketService,
    public stateService: StateService
  ) {
    this.webSocketService.listen('filter').subscribe((data: any[]) => {
      if (this.control != undefined) {
        this.filteredOptions = this.drugs[
          this.activeInput
        ].control.valueChanges.pipe(
          map((value) => this._filter(value, data).sort())
        );
      }
    });
    stateService.sidenavStatus$.subscribe((isOpen: boolean) => {
      this.sidenavActive = isOpen;
    });
  }
}

export interface DrugInput {
  id: number;
  control: FormControl;
}

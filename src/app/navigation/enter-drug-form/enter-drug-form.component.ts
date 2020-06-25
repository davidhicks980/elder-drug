import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  ViewChild,
  Input,
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
  myControl = new FormControl();
  newOptions: any;
  filterList: any;
  filteredOptions: Observable<string[]>;
  activeString: string;
  selectedTablesOnSearch: string[];
  @Input() navToggled: boolean = true;
  public drugs: Array<Object> = [
    {
      id: '',
      name: '',
    },
  ];

  i: number;

  addDrug() {
    let index = this.drugs.length + 1;
    if (this.drugs.length <= 30) this.drugs.push({ id: index, name: '' });
  }

  removeDrug(i: number) {
    if (this.drugs.length > 1) {
      this.drugs.splice(i, 1);
    }
  }
  boldString(option: string, active: string) {
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
  ngOnInit() {}
  ConvertToJSON(product: any) {
    return JSON.parse(product);
  }

  getInputString(input: string) {
    this.activeString = input;
    if (input.length === 2) {
      this.webSocketService.emit('drugs-to-filter', input);
    }
  }
  keyDownFunction(event) {
    if (event.keyCode === 13) {
      alert('you just pressed the enter key');
    }
  }
  search(entry) {
    let outArray = [];
    let results = entry._results;
    results.forEach((element) => {
      outArray.push(element.value);
    });
    this.webSocketService.emit('drugs-to-search', outArray);
    this.selectedTablesOnSearch = ['General Info'];
  }

  close() {
    this.sidenav.close();
  }

  constructor(public webSocketService: WebsocketService) {
    this.webSocketService.listen('filter').subscribe((data: any[]) => {
      let i: number;
      let length = data.length;
      let dropDown = [];
      for (i = 0; i < length; i++) {
        dropDown.push(data[i].Items.toLowerCase()); //TODO: Column is defined by dot notation
      }
      this.filteredOptions = this.myControl.valueChanges.pipe(
        map((value) => this._filter(value, dropDown).sort())
      );
    });
  }
}

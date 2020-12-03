import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  FormArray,
  Validators,
} from '@angular/forms';

import { MatInput } from '@angular/material/input';
import { MatSidenav } from '@angular/material/sidenav';

import { Observable } from 'rxjs';
import { WebsocketService } from '../../websocket.service';
import { StateService } from 'src/app/state.service';

import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { inputAnimation } from '../../animations';

@Component({
  selector: 'app-enter-drug-form',
  templateUrl: './enter-drug-form.component.html',
  styleUrls: ['./enter-drug-form.component.scss'],
  animations: [inputAnimation],
})
export class EnterDrugFormComponent implements OnInit {
  @ViewChildren(MatAutocompleteTrigger) trigger: QueryList<
    MatAutocompleteTrigger
  >;
  @ViewChildren(MatInput) submission: QueryList<MatInput>;
  // @ViewChildren('searchInputs') submission: ElementRef;
  @ViewChild('drawer') public sidenav: MatSidenav;
  drugsGroup: FormGroup = this.fb.group({
    drugs: this.fb.array([
      this.fb.control('', [
        Validators.pattern('[a-zA-Z ]*'),
        Validators.minLength(2),
        Validators.maxLength(70),
      ]),
    ]),
  });
  filterList: any;
  sidenavActive: boolean;
  activeString: string;
  i: number;
  activeInput = 0;
  items: any;
  dropdownItems: any[];
  out: any;
  dropdownItemsSearch: any;
  dropdownArray: {};
  filteredOptions: Observable<string[]>;
  entryValue: string;

  sideOpen: boolean;

  boldDropdownText(option: string, active: string) {
    const index = option.search(active);
    const subString = option.substring(index, index + 50);
    return '<p>' + subString.replace(active, active.bold()) + '</p>';
  }

  name(i: number) {
    return this.drugs.at(i);
  }
  get drugs() {
    return this.drugsGroup.get('drugs') as FormArray;
  }
  search() {
    const out = [];
    let index = 0;
    this.drugs.value.filter((drug) => {
      this.fire.entryMap.has(drug.toLowerCase())
        ? out.push(drug)
        : this.drugs.controls[index].setErrors({
            notDrug: true,
          });
      index++;
    });
    if (out.length > 0) {
      this.fire.searchDrugs(out);
      this.stateService.toggleSidenav();
    } else {
      this.openDialog();
    }
  }
  stopPropagation() {
    event.stopPropagation();
  }

  addDrug() {
    if (this.drugs.length < 8) {
      this.drugs.push(
        this.fb.control('', [
          Validators.pattern('[a-zA-Z ]*'),
          Validators.minLength(2),
          Validators.maxLength(70),
        ])
      );
    }
  }
  ngOnInit() {
    this.sidenavActive = this.stateService.sidenavOpen;
    this.stateService.toggleSidenav();
  }
  deleteFormControl(index: number) {
    this.drugs.removeAt(index);
  }

  async getDropdownItems(input: string) {
    if (input.length > 1) {
      this.entryValue = input;
      const filteredOptions = await this.fire.filterValues(input);
      if (filteredOptions) {
        this.dropdownItems = filteredOptions.slice(0, 5);
      }
    }
  }

  constructor(
    public stateService: StateService,
    public fire: WebsocketService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.sideOpen = this.stateService.sidenavOpen;
    iconRegistry.addSvgIcon(
      'add-circle-outline.svg',
      sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/add_circle_outline.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'delete.svg',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/delete.svg')
    );
  }
  openDialog() {
    this.dialog.open(EmptyInputComponent, { width: '20em' });
  }
}

@Component({
  selector: 'empty-input-dialog-component',
  templateUrl: 'empty-input.html',
})
export class EmptyInputComponent {}

export interface DrugInput {
  id: number;
  control: FormControl;
}

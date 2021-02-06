import { ChangeDetectionStrategy, Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { MatSidenav } from '@angular/material/sidenav';
import { interval, Observable } from 'rxjs';
import { debounce } from 'rxjs/operators';
import { LayoutStatus, StateService } from 'src/app/services/state.service';

import { inputAnimation } from '../../../../animations';
import { FirebaseService } from '../../../../services/firebase.service';

@Component({
  selector: 'elder-drug-form',
  templateUrl: './drug-form.component.html',
  styleUrls: ['./drug-form.component.scss'],
  animations: [inputAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrugFormComponent {
  @ViewChildren(MatAutocompleteTrigger) trigger: QueryList<
    MatAutocompleteTrigger
  >;
  @ViewChildren(MatInput) submission: QueryList<MatInput>;
  // @ViewChildren('searchInputs') submission: ElementRef;
  @ViewChild('drawer') public sidenav: MatSidenav;
  drugsGroup: FormGroup = this.fb.group({
    drugs: this.fb.array([
      new FormControl('', [
        Validators.pattern('[a-zA-Z0-9 -]*'),
        Validators.minLength(2),
        Validators.maxLength(70),
      ]),
    ]),
  });
  sidenavActive: boolean;
  i: number;
  activeInput = 0;
  dropdownItemsSearch: any;
  dropdownArray: {};
  dropdownItems: Observable<string[][]>;
  filteredOptions: Observable<string[]>;
  entryValue: string;
  sideOpen: boolean;
  layout: LayoutStatus;
  private _activeInputIndex: number;
  boldInputText(option: string, active: string) {
    const index = option.search(active);
    const subString = option.substring(index, index + 50);
    return '<p>' + subString.replace(active, active.bold()) + '</p>';
  }

  get drugs(): FormArray {
    return this.drugsGroup.get('drugs') as FormArray;
  }
  get inputLength(): number {
    return this.drugs.length;
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
      this.state.toggleSidenav();
    } else {
      this.openDialog();
    }
  }
  stopPropagation() {
    event.stopPropagation();
  }
  set activeInputIndex(index: number) {
    this._activeInputIndex = index;
  }

  addInput() {
    if (this.drugs.length < 8) {
      this.drugs.push(
        this.fb.control('', [
          Validators.pattern('[a-zA-Z0-9 -]*'),
          Validators.minLength(2),
          Validators.maxLength(70),
        ])
      );
    }
  }
  removeInputAt(index: number) {
    this.drugs.removeAt(index);
  }

  constructor(
    public state: StateService,
    public fire: FirebaseService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    /* const index = option.search(active);
    const subString = option.substring(index, index + 50);
    return '<p>' + subString.replace(active, active.bold()) + '</p>';*/
    this.drugs.valueChanges
      .pipe(debounce(() => interval(50)))
      .subscribe((res) => {
        fire.filterValues(res[this._activeInputIndex]);
      });
    this.dropdownItems = fire.filteredItems$;
    this.state.windowWidth$.subscribe((layoutStatus: LayoutStatus): void => {
      this.layout = layoutStatus;
    });
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

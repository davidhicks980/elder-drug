import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, map, takeUntil } from 'rxjs/operators';
import { StateService } from 'src/app/services/state.service';

import { inputAnimation } from '../../../../animations';
import { DataService } from '../../../../services/data.service';

@Component({
  selector: 'elder-drug-form',
  templateUrl: './drug-form.component.html',
  styleUrls: ['./drug-form.component.scss'],
  animations: [inputAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrugFormComponent implements OnDestroy {
  @ViewChild('drawer') public sidenav: MatSidenav;
  isDestroyed = new Subject();
  observeDestruction$ = this.isDestroyed.asObservable();
  drugsGroup: FormGroup = this.fb.group({
    drugInput: new FormControl('', [
      //prettier-ignore
      Validators.pattern('([\w\s\,-.])+'),
      Validators.minLength(2),
      Validators.maxLength(70),
    ]),
    drugList: new FormArray([]),
  });
  private autocompleteListener = new Subject() as Subject<string[][]>;
  autocompleteObserver = this.autocompleteListener.asObservable().pipe(
    debounceTime(25),
    takeUntil(this.observeDestruction$),
    map((val) => (val.length < 1 ? [['Not found']] : val))
  );

  get drugList(): FormArray {
    return this.drugsGroup.get('drugList') as FormArray;
  }
  get drugInput(): FormControl {
    return this.drugsGroup.get('drugInput') as FormControl;
  }
  get inputLength(): number {
    return this.drugInput.value.length;
  }
  get sortedList() {
    return this.drugList.value.slice().sort((a, b) => a.length - b.length);
  }
  get drugListLength(): number {
    return this.drugList.length;
  }
  search() {
    this.drugList.value.length > 0
      ? (this.database.searchDrugs(), this.state.toggleSidenav())
      : this.openDialog();
  }
  stopPropagation(e) {
    e.stopPropagation();
  }

  checkForDrug(drug: string) {
    return this.database.hasDrug(drug);
  }
  chooseOption(optionValue: string) {
    if (this.database.hasDrug(optionValue)) {
      this.drugInput.setValue(optionValue);
      this.addInput();
    }
  }
  addInput() {
    if (
      this.drugList.value.length < 8 &&
      this.database.hasDrug(this.drugInput.value)
    ) {
      this.drugList.push(new FormControl(this.drugInput.value));
      setTimeout(() => this.drugInput.setValue(''), 30);
    } else {
    }
  }

  removeOptionAt(index: number) {
    return this.drugList.removeAt(index);
  }

  filterAutocomplete(input: string) {
    if (input && input.length > 1) {
      this.autocompleteListener.next(
        this.database
          .filterValues(input)
          .map((item: string) => [input, item.slice(input.length)])
      );
    } else if (input && input.length > 0)
      this.autocompleteListener.next([['Enter a drug']]);
  }
  ngOnDestroy() {
    this.isDestroyed.next(true);
  }
  constructor(
    public state: StateService,
    public database: DataService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.drugList.controls = database.lastSearch.map(
      (val) => new FormControl(val)
    );
    this.drugList.valueChanges
      .pipe(takeUntil(this.observeDestruction$))
      .subscribe(database.changeDrugs());
    this.drugsGroup.statusChanges
      .pipe(takeUntil(this.observeDestruction$))
      .subscribe((change) => {
        this.invalid.emit(this.checkValidity(change));
      });
  }
  checkValidity = (change) => {
    return change === 'INVALID';
  };
  @Output('invalid') invalid: EventEmitter<boolean> = new EventEmitter();
  openDialog() {
    this.dialog.open(EmptyInputComponent, { width: '20em' });
  }

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
}

@Component({
  selector: 'empty-input-dialog-component',
  templateUrl: 'empty-input.html',
})
export class EmptyInputComponent {}

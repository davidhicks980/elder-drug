import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ResizeService } from 'src/app/services/resize.service';

import { inputAnimation } from '../../../../animations';
import { DataService } from '../../../../services/data.service';
import { DrugPresenceValidator } from '../../../../services/drug-presence-validator.service';

@Component({
  selector: 'elder-drug-form',
  templateUrl: './drug-form.component.html',
  styleUrls: ['./drug-form.component.scss'],
  animations: [
    inputAnimation,
    trigger('fadeAutocomplete', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('100ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('100ms', style({ opacity: 0 }))]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrugFormComponent implements OnDestroy {
  @ViewChild('drawer') public sidenav: MatSidenav;

  inputValidators = [
    Validators.pattern('[\\w.\\s-]*'),
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(70),
  ];
  isDestroyed = new Subject();
  observeDestruction$ = this.isDestroyed.asObservable();
  drugsGroup: FormGroup = this.fb.group(
    {
      drugInput: new FormControl(
        '',
        this.inputValidators,
        this.drugPresence.createValidator(this.database, 300)
      ),
      drugList: new FormArray([]),
    },
    { updateOn: 'change' }
  );
  private autocompleteListener = new Subject() as Subject<string[][]>;
  autocompleteObserver = this.autocompleteListener
    .asObservable()
    .pipe(takeUntil(this.observeDestruction$), debounceTime(120));
  loading: boolean;

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

  search(alternative: string[]) {
    let search = alternative || this.drugList.value;
    search.length > 0
      ? (this.database.searchDrugs(search), this.state.toggleSidenav())
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
      let newControl = new FormControl(
        this.drugInput.value,
        this.inputValidators,
        this.drugPresence.createValidator(this.database, 400)
      );
      this.drugList.push(newControl);
      setTimeout(() => this.drugInput.setValue(''), 30);
    }
  }

  removeOptionAt(index: number) {
    return this.drugList.removeAt(index);
  }

  getControlAt(index: number) {
    return this.drugList.controls[index];
  }
  filterAutocomplete(input: string) {
    const sliceString = (item: string) => [
      input,
      item.slice(input.length, -2),
      item.slice(-2),
    ];
    if (!input || !input.length) {
      this.autocompleteListener.next([]);
    } else if (input.length > 1) {
      this.autocompleteListener.next(
        this.database.filterValues(input).map(sliceString)
      );
    }
  }
  ngOnDestroy() {
    this.isDestroyed.next(true);
  }
  get autocompleteConnectedInput() {
    return true;
  }
  constructor(
    public state: ResizeService,
    public database: DataService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private drugPresence: DrugPresenceValidator
  ) {
    this.drugList.controls = database.lastSearch.map(
      (val) => new FormControl(val)
    );
    this.drugsGroup.valueChanges
      .pipe(takeUntil(this.observeDestruction$))
      .subscribe((group) => {
        database.storeHistory([group.drugInput, ...group.drugList]);
      });
    this.drugsGroup.statusChanges
      .pipe(takeUntil(this.observeDestruction$))
      .subscribe((change) => {
        this.invalid.emit(change === 'INVALID');
        this.loading = false;
      });
  }
  log(x) {
    console.log(x);
  }

  @Output('invalid') invalid: EventEmitter<boolean> = new EventEmitter();
  openDialog() {
    this.dialog.open(EmptyInputComponent, { width: '20em' });
  }
}

@Component({
  selector: 'empty-input-dialog-component',
  templateUrl: 'empty-input.html',
})
export class EmptyInputComponent {}

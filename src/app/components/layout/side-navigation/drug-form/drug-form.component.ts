import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, merge, Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, takeUntil, tap } from 'rxjs/operators';
import { ResizeService } from 'src/app/services/resize.service';

import { inputAnimation } from '../../../../animations';
import { DataService } from '../../../../services/data.service';
import { DrugPresenceValidator } from '../../../../services/drug-presence-validator.service';

@Component({
  selector: 'elder-drug-form',
  templateUrl: './drug-form.component.html',
  styleUrls: [
    './drug-form.component.scss',
    './terms.drug-form.component.scss',
    './icons.drug-form.component.scss',
    './autocomplete.drug-form.scss',
    './submit.drug-form.component.scss',
  ],
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
export class DrugFormComponent implements OnDestroy, AfterViewInit {
  _focusSource = new BehaviorSubject(false);
  isFocused$ = this._focusSource.asObservable();
  hasContent$: Observable<boolean>;
  statusChange$: Observable<boolean>;
  isPending$: Observable<boolean>;
  pinSearch: Observable<boolean>;
  panelOpen = new BehaviorSubject(false);
  @Output() isSearching = new EventEmitter(false);
  ngOnDestroy() {
    this.isDestroyed.next(true);
  }
  ngAfterViewInit() {
    this.hasContent$ = merge(
      this.drugInput.valueChanges.pipe(
        map((val) => this.drugInput.value.length > 0)
      ),
      of(false)
    ) as Observable<boolean>;

    this.hasContent$.subscribe((test) => console.log(test, 'test'));
    this.pinSearch = combineLatest([this._focusSource, this.hasContent$]).pipe(
      filter(([focus, content]) => focus === content),
      distinctUntilChanged(),
      map(([focus, change]) => focus.valueOf()),
      tap((status) => this.isSearching.emit(status))
    );
  }
  setFocusStatus($event) {
    this._focusSource.next($event != null);
  }
  constructor(
    public size: ResizeService,
    public database: DataService,
    private form: FormBuilder,
    public dialog: MatDialog,
    private drugPresence: DrugPresenceValidator
  ) {
    this.isMobile$ = size.mobileObserver;
    this.drugList.controls = database.lastSearch.map(
      (val) => new FormControl(val)
    );
    this.drugsGroup.valueChanges
      .pipe(takeUntil(this.observeDestruction$))
      .subscribe((group: FormGroup) => {
        database.storeHistory([group['drugInput'], ...group['drugList']]);
      });
    this.isPending$ = this.drugInput.statusChanges.pipe(
      distinctUntilChanged(),
      map((val) => val === 'PENDING')
    );
  }
  inputValidators = [
    Validators.pattern('[\\w.\\s-]*'),
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(70),
  ];
  isDestroyed = new Subject();
  observeDestruction$ = this.isDestroyed.asObservable();
  drugsGroup: FormGroup = this.form.group(
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
    .pipe(takeUntil(this.observeDestruction$), debounceTime(16));
  loading: boolean;
  isMobile$: Observable<boolean>;

  get drugList(): FormArray {
    return this.drugsGroup.get('drugList') as FormArray;
  }
  get drugInput(): FormControl {
    return this.drugsGroup.get('drugInput') as FormControl;
  }
  get inputLength(): number {
    return this.drugInput.value.length;
  }

  get drugListLength(): number {
    return this.drugList.length;
  }

  search(alternative: string[]) {
    let search = alternative || this.drugList.value;
    search.length > 0
      ? (this.database.searchDrugs(search), this.size.toggleSidenav())
      : this.openDialog();
  }
  stopPropagation(e) {
    e.stopPropagation();
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

  openDialog() {
    this.dialog.open(EmptyInputComponent, { width: '20em' });
  }
}

@Component({
  selector: 'empty-input-dialog-component',
  templateUrl: 'empty-input.html',
})
export class EmptyInputComponent {}

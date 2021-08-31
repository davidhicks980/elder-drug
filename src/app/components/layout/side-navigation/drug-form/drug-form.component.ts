import { animate, style, transition, trigger } from '@angular/animations';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { matFormFieldAnimations } from '@angular/material/form-field';
import { BehaviorSubject, combineLatest, MonoTypeOperatorFunction, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, pluck, take, takeUntil, tap } from 'rxjs/operators';
import { ResizeService } from 'src/app/services/resize.service';

import { inputAnimation } from '../../../../animations';
import { SEARCH_VALIDATORS } from '../../../../constants/validators.constants';
import { TypeaheadState } from '../../../../interfaces/typeahead-state.type';
import { DataService } from '../../../../services/data.service';
import { DrugPresenceValidator } from '../../../../services/drug-presence-validator.service';
import { SearchButtonsComponent } from './search-buttons/search-buttons.component';

@Component({
  selector: 'elder-drug-form',
  templateUrl: './drug-form.component.html',
  styleUrls: [
    './drug-form.component.scss',
    './terms.drug-form.component.scss',
    './icons.drug-form.component.scss',
    './autocomplete.drug-form.scss',
  ],
  animations: [
    matFormFieldAnimations.transitionMessages,
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
export class DrugFormComponent
  implements OnDestroy, AfterViewInit, AfterContentInit {
  @Output('searching') searchEmitter = new EventEmitter();
  @ViewChild(MatAutocomplete) trigger: MatAutocomplete;
  @ContentChild(SearchButtonsComponent) buttons: SearchButtonsComponent;
  activeControl: number = -10;
  _destroyedSource = new Subject();
  destroyed$ = this._destroyedSource.asObservable().pipe(take(1));
  drugsGroup: FormGroup = this.form.group(
    {
      drugInput: new FormControl(
        '',
        SEARCH_VALIDATORS,
        this.drugPresence.createValidator(this.database, 300)
      ),
      drugList: new FormArray([]),
    },
    { updateOn: 'change' }
  );
  _focusSource = new BehaviorSubject({ focused: false, control: -1 });
  focusState$ = this._focusSource.asObservable();
  _isFocused$ = this.focusState$.pipe(map((c) => c.focused));
  searchStarted$: Observable<boolean>;
  _isMobile$: Observable<boolean>;
  _inputLengthSource = new BehaviorSubject(0);
  _isSearchEmpty$: Observable<boolean>;
  _typeaheadState: TypeaheadState = {
    pending: false,
    open: false,
    length: 0,
    data: [],
    edit: false,
  };
  searchComponentPortal: ComponentPortal<SearchButtonsComponent>;
  inputStream = new BehaviorSubject('');

  updateAutocompleteStatus() {
    console.log('update');
  }
  ngOnDestroy() {
    this._destroyedSource.next(true);
  }
  ngAfterViewInit() {
    this._isSearchEmpty$ = this.typeaheadState$.pipe(
      pluck('length'),
      map((len) => len === 0)
    );
    const searchObservers = [this._isFocused$, this._isSearchEmpty$];
    const emitSearch = tap((status) =>
      this.searchEmitter.emit(status)
    ) as MonoTypeOperatorFunction<boolean>;
    this.searchStarted$ = this._watchForSearch(searchObservers).pipe(
      emitSearch
    );
    this._watchPanelState(this._isFocused$, this.typeaheadState$);
  }

  _watchPanelState(
    focused: Observable<boolean>,
    state: Observable<TypeaheadState>
  ) {
    const hasData = state.pipe(map(({ data }) => data.length > 0));

    hasData.pipe(distinctUntilChanged());
  }
  constructor(
    public size: ResizeService,
    public database: DataService,
    private form: FormBuilder,
    public dialog: MatDialog,
    private drugPresence: DrugPresenceValidator,
  ) {
    this._typeaheadSource = new BehaviorSubject(this._typeaheadState);
    this.typeaheadState$ = this._typeaheadSource.asObservable();
    this.searchEmitter.emit(false);
    this._isMobile$ = size.mobileObserver;
    this.drugList.controls = database.lastSearch.map((v) => new FormControl(v));
    this._handleFormValueChanges(database, this.drugsGroup).subscribe(() => {});

    this._watchForInputState(this.drugInput, 'PENDING').subscribe((pending) =>
      this._updateTypeahead({ pending })
    );
  }

  ngAfterContentInit() {
    this.buttons.search.subscribe(console.log);
  }
  private _watchForSearch([focused, empty]: Observable<boolean>[]) {
    return combineLatest([focused, empty]).pipe(
      filter(([focus, empty]) => focus === !empty),
      distinctUntilChanged(),
      map(([focus, _change]) => focus.valueOf())
    );
  }

  private _handleFormValueChanges(database, group: FormGroup) {
    const updateHistory = ({ drugList, drugInput }) =>
      Array.isArray(drugList) ?? this.database.storeHistory(drugList);

    return group.valueChanges.pipe(
      tap(updateHistory),
      map((form) =>
        this.activeControl > -1
          ? form.drugList[this.activeControl]
          : form.drugInput
      ),
      distinctUntilChanged(),
      map((input) => this.lookupTypeaheadResults(input, database)),
      map((data) =>
        this._updateTypeahead({
          data,
          length: data.length,
          open: data.length > 0,
        })
      )
    );
  }
  private _watchForInputState(input: FormControl, state: string) {
    const checkIfPending = (state: string) => state === 'state';

    return input.statusChanges.pipe(
      takeUntil(this.destroyed$),
      distinctUntilChanged(),
      map(checkIfPending)
    );
  }

  getTooltipText(tooltip: string) {
    switch (tooltip) {
      case 'add':
        return this.drugInput.valid
          ? 'Add drug to search'
          : 'Choose a drug from the dropdown';
    }
  }
  setFocusStatus($event, activeInput: number) {
    this.activeControl = activeInput;
    this._focusSource.next({ focused: $event != null, control: activeInput });
  }
  get focusedControl() {
    const el = (document.activeElement as HTMLInputElement) || null;
    if (
      el?.hasOwnProperty('dataset') &&
      el.dataset?.hasOwnProperty('control') &&
      this.activeControl === parseInt(el.dataset.control)
    ) {
      return this._focusSource.value.control;
    }
  }
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
  search() {
    let search = [...this.drugList.value];
    search.length > 0
      ? (this.database.searchDrugs(search), this.size.toggleSidenav())
      : this.openDialog();
  }
  stopPropagation(e) {
    e.stopPropagation();
  }

  chooseTerm({ option }: MatAutocompleteSelectedEvent) {
    if (this.database.hasDrug(option.value)) {
      this.drugInput.setValue(option.value);
      if (this.activeControl === -1) {
        this.addTerm();
        setTimeout(() => this.search(), 30);
      }
    }
  }
  addTerm() {
    if (
      this.drugList.value.length < 8 &&
      this.database.hasDrug(this.drugInput.value)
    ) {
      let newControl = new FormControl(
        this.drugInput.value,
        SEARCH_VALIDATORS,
        this.drugPresence.createValidator(this.database, 400)
      );
      this.drugList.push(newControl);
      setTimeout(() => this.drugInput.setValue(''), 30);
    }
  }

  removeTermAt(index: number) {
    return this.drugList.removeAt(index);
  }

  getControlAt(index: number) {
    return this.drugList.controls[index];
  }

  openDialog() {
    this.dialog.open(EmptyInputComponent, { width: '20em' });
  }

  /******************/
  /*TYPEAHEAD LOGIC */
  /******************/
  _typeaheadSource: BehaviorSubject<TypeaheadState>;
  typeaheadState$: Observable<TypeaheadState>;
  lookupTypeaheadResults(value: string, database: DataService) {
    const sliceString = (item: string) => [
      value,
      item.slice(value.length, -2),
      item.slice(-2),
    ];
    if (!value || value.length <= 1) {
      return [];
    } else if (value.length > 1) {
      return database.filterValues(value).map(sliceString);
    }
  }
  _updateTypeahead(state: Partial<TypeaheadState>) {
    this._typeaheadState = Object.assign(this._typeaheadState, state);
    this._typeaheadSource.next(this._typeaheadState);
  }
}
@Component({
  selector: 'empty-input-dialog-component',
  templateUrl: 'empty-input.html',
})
export class EmptyInputComponent {}

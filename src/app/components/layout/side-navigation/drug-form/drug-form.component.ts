import { trigger } from '@angular/animations';
import { CdkPortal, CdkPortalOutlet, ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { AsyncValidatorFn, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { matFormFieldAnimations } from '@angular/material/form-field';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { distinct, distinctUntilChanged, filter, map, take, takeUntil, tap } from 'rxjs/operators';
import { ResizeService } from 'src/app/services/resize.service';

import { TypeaheadState } from '../../../../interfaces/typeahead-state.type';
import { DataService } from '../../../../services/data.service';
import { CustomValidators } from '../../../../validators/index.validators';
import { drugFormAnimations } from './drug-form.animations';
import { SearchButtonsComponent } from './search-buttons/search-buttons.component';

@Component({
  selector: 'elder-drug-form',
  templateUrl: './drug-form.component.html',
  styleUrls: [
    './drug-form.component.scss',
    './edit-list.drug-form.component.scss',
    './icons.drug-form.component.scss',
    './autocomplete.drug-form.scss',
    './scrollbar.scss',
  ],
  animations: [
    matFormFieldAnimations.transitionMessages,
    drugFormAnimations.shiftEditList('shiftEditList', '-35px'),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrugFormComponent implements OnDestroy, AfterViewInit {
  @Output('searching') searchEmitter: EventEmitter<boolean> =
    new EventEmitter();
  @ViewChild(MatAutocomplete) typeahead: MatAutocomplete;
  @ViewChild(CdkPortal) buttonTemplate: CdkPortal;
  @ViewChildren(MatAutocompleteTrigger)
  typeaheadTriggers: QueryList<MatAutocompleteTrigger>;
  @ViewChild('buttonOutlet')
  portalOutlet: CdkPortalOutlet;
  activeControl: number = -1;
  _destroyedSource = new Subject();
  destroyed$ = this._destroyedSource.asObservable().pipe(take(1));
  drugsGroup: FormGroup;
  _focusSource = new BehaviorSubject({ focused: false, control: -1 });
  focusState$ = this._focusSource.asObservable();
  formControlFocused$ = this.focusState$.pipe(map((c) => c.focused));
  searchInProgress$: Observable<boolean>;
  mobile$: Observable<boolean>;
  emptySearch$: Observable<boolean>;
  typeaheadSource: BehaviorSubject<TypeaheadState>;
  typeaheadState$: Observable<TypeaheadState>;
  searchComponentPortal: ComponentPortal<SearchButtonsComponent>;
  inputStream = new BehaviorSubject('');
  buttonPortal: TemplatePortal<unknown>;

  ngOnDestroy() {
    this._destroyedSource.next(true);
  }

  ngOnInit() {
    this.drugList.controls = this.database.lastSearch.map(
      (v) => new FormControl(v)
    );
    this._watchForInputState(this.drugInput, 'PENDING').subscribe((pending) =>
      this.updateTypeahead({ pending })
    );
    this._handleFormValueChanges(this.database, this.drugsGroup).subscribe();
  }
  ngAfterViewInit() {
    const searchObservers = [
      this.formControlFocused$,
      this.typeaheadState$.pipe(map((s) => s.length === 0)),
    ];
    this.searchInProgress$ = this.observeSearchProgress$(searchObservers).pipe(
      filter((val) => val === true),
      take(1)
    );
    this.searchInProgress$.subscribe((isSearching) =>
      this.searchEmitter.emit(isSearching)
    );

    this.mobile$ = this.size.mobileObserver;
  }

  constructor(
    private size: ResizeService,
    public database: DataService,
    private form: FormBuilder,
    public dialog: MatDialog
  ) {
    this.typeaheadSource = new BehaviorSubject({
      pending: false,
      open: false,
      length: 0,
      data: [],
      edit: false,
    });
    this.typeaheadState$ = this.typeaheadSource.asObservable();
    this.searchEmitter.emit(false);
    const { input, array } = this.getTermValidators();
    this.drugsGroup = this.form.group(
      {
        drugInput: new FormControl('', input.sync, input.async),
        drugList: new FormArray([], array.sync, array.async),
      },
      { updateOn: 'change' }
    );
    const getAllDrugs = function () {
      return this.drugList.value ?? [];
    };
    this.drugInput.addValidators(
      CustomValidators.sync.uniqueTerms(getAllDrugs.bind(this))
    );
  }

  observeSearchProgress$([inputFocused, inputEmpty]: Observable<boolean>[]) {
    return combineLatest([inputFocused, inputEmpty]).pipe(
      filter(([focus, empty]) => focus === !empty),
      map(([focus, _]) => focus),
      distinct()
    );
  }

  private _handleFormValueChanges(database, group: FormGroup) {
    return group.valueChanges.pipe(
      tap(({ drugList }: { drugList: string[] }) => {
        if (Array.isArray(drugList)) {
          this.database.storeHistory(drugList);
        }
      }),
      map((form: { drugList: string[]; drugInput: string }) => {
        return this.activeControl > -1
          ? form.drugList[this.activeControl]
          : form.drugInput;
      }),
      distinctUntilChanged(),
      map((input: string) => this.lookupTypeaheadTerms(input, database)),
      map((data: string[][]) => {
        return this.updateTypeahead({
          data,
          length: data.length,
          open: data.length > 0,
        });
      })
    );
  }
  private _watchForInputState(input: FormControl, state: string) {
    return input.statusChanges.pipe(
      takeUntil(this.destroyed$),
      distinctUntilChanged(),
      map((inputState: string) => inputState === state)
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
  get focusedControl(): number | undefined {
    const control = document.activeElement.getAttribute('data-control');
    if (control != null && this.activeControl === parseInt(control)) {
      return this._focusSource.value.control;
    } else {
      return undefined;
    }
  }

  get drugList(): FormArray {
    return this.drugsGroup.get('drugList') as FormArray;
  }
  get drugInput(): FormControl {
    return this.drugsGroup.get('drugInput') as FormControl;
  }
  get searchInputLength(): number {
    return this.drugInput.value.length;
  }
  get drugListLength(): number {
    return this.drugList.length;
  }

  search($event: Event) {
    $event.preventDefault();
    let search = [...this.drugList.value];
    if (search.length > 0) {
      this.database.searchDrugs(search);
      this.size.toggleSidenav();
    }
  }

  chooseTerm({ option }: MatAutocompleteSelectedEvent) {
    this.drugInput.setValue(option.value);
    if (
      this.activeControl === -1 &&
      this.drugList.errors === null &&
      this.drugInput.errors === null
    ) {
      this.addTerm();
    }
  }
  getTermValidators(this: DrugFormComponent): {
    input: { sync: ValidatorFn[]; async: AsyncValidatorFn[] };
    array: { sync: ValidatorFn[]; async: AsyncValidatorFn[] };
  } {
    const getHasDrugFn = function (drugDatabase: DataService) {
      return function (value: string) {
        return drugDatabase.hasDrug(value);
      };
    };
    return {
      input: {
        async: [
          CustomValidators.async.termExistsInDatabase(
            getHasDrugFn(this.database),
            300
          ),
        ],
        sync: [
          Validators.pattern('[\\w.\\s-]*'),
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(70),
        ],
      },
      array: {
        sync: [Validators.maxLength(20)],
        async: [],
      },
    };
  }
  addTerm() {
    const { sync, async } = this.getTermValidators().input;
    const newEditableInput = new FormControl(this.drugInput.value, sync, async);
    this.drugList.push(newEditableInput);
    window.requestAnimationFrame(() => {
      this.drugInput.setValue('');
    });
  }

  deleteListControl(index: number) {
    return this.drugList.removeAt(index);
  }

  getListControl(index: number) {
    return this.drugList.controls[index];
  }

  lookupTypeaheadTerms(value: string, database: DataService) {
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
  updateActiveTrigger() {
    this.updateTypeahead({
      trigger: this.typeaheadTriggers.filter((t) => t.panelOpen)[0] || null,
    });
  }
  updateTypeahead(state: Partial<TypeaheadState>) {
    this.typeaheadSource.next(Object.assign(this.typeaheadSource.value, state));
  }
}

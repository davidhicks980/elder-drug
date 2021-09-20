import { trigger } from '@angular/animations';
import { CdkPortal, CdkPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
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
import { distinctUntilChanged, filter, map, take, takeUntil } from 'rxjs/operators';

import { TypeaheadState } from '../../../../interfaces/TypeaheadState';
import { DataService } from '../../../../services/data.service';
import { ResizeService } from '../../../../services/resize.service';
import { SearchService } from '../../../../services/search.service';
import { CustomValidators } from '../../../../validators/index.validators';
import { drugFormAnimations } from './drug-form.animations';

const TYPEAHEAD_INITIAL_STATE = {
  pending: false,
  open: false,
  length: 0,
  data: [],
  edit: false,
};
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

  private destroyedSource = new Subject();
  destroyed$ = this.destroyedSource.asObservable().pipe(take(1));
  private activeControl: number = -1;
  drugsGroup: FormGroup;
  private focusSource = new BehaviorSubject({ focused: false, control: -1 });
  formControlFocused$ = this.focusSource.asObservable().pipe(
    takeUntil(this.destroyed$),
    map((c) => c.focused)
  );
  searchInProgress$: Observable<boolean>;
  mobile$: Observable<boolean>;
  private typeaheadSource: BehaviorSubject<TypeaheadState> =
    new BehaviorSubject(TYPEAHEAD_INITIAL_STATE);

  typeaheadState$: Observable<TypeaheadState> =
    this.typeaheadSource.asObservable();
  buttonPortal: TemplatePortal<unknown>;

  errorMessages: Record<string, string> = {
    duplicate: `Drug has already been entered.`,
    minlength: `Drug names must be at least 3 characters long.`,
    maxlength: ` Drug names should be fewer than 70 characters.`,
    pattern: `Drug names should only contain alphanumeric letters.`,
  };
  warningMessages: Record<string, string> = {
    termabsent: `Only drugs from the dropdown menu have guidance.`,
  };

  ngOnDestroy() {
    this.destroyedSource.next(true);
  }

  ngOnInit() {
    this.drugList.controls = this.searchService.history.map(
      (v) => new FormControl(v)
    );
    this.observeInputStateChange('PENDING').subscribe((pending) =>
      this.updateTypeahead({ pending })
    );
    this.handleTypeahead().subscribe();
  }
  ngAfterViewInit() {
    const searchObservers = [
      this.formControlFocused$,
      this.typeaheadState$.pipe(map((s) => s.length === 0)),
    ];
    this.searchInProgress$ = this.createSearchProgressObserver(
      searchObservers
    ).pipe(
      filter((val) => val === true),
      take(1)
    );
    takeUntil(this.destroyed$),
      this.searchInProgress$.subscribe((isSearching) =>
        this.searchEmitter.emit(isSearching)
      );

    this.mobile$ = this.size.mobileObserver;
  }

  constructor(
    private size: ResizeService,
    public database: DataService,
    private searchService: SearchService,
    private form: FormBuilder,
    public dialog: MatDialog
  ) {
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

  createSearchProgressObserver([
    inputFocused,
    inputEmpty,
  ]: Observable<boolean>[]) {
    return combineLatest([inputFocused, inputEmpty]).pipe(
      filter(([focus, empty]) => (focus && !empty) || (empty && !focus)),
      map(([focus, _]) => focus),
      distinctUntilChanged()
    );
  }
  handleHistory(): void {
    this.drugList.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((queries) => {
        this.searchService.storeHistory(queries);
      });
  }

  private handleTypeahead() {
    return this.drugsGroup.valueChanges.pipe(
      takeUntil(this.destroyed$),
      map((form: { drugList: string[]; drugInput: string }) => {
        if (this.activeControl > -1) {
          return form.drugList[this.activeControl];
        } else {
          return form.drugInput;
        }
      }),
      map((input: string) => {
        let data = this.lookupTypeaheadTerms(input),
          length = data.length,
          open = length > 0;

        return this.updateTypeahead({ data, length, open });
      })
    );
  }
  private observeInputStateChange(state: string): Observable<boolean> {
    return this.drugInput.statusChanges.pipe(
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
    this.focusSource.next({ focused: $event != null, control: activeInput });
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
      this.searchService.searchDrugs(search);
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
    const getHasDrugFn = function (this: SearchService, value: string) {
      return this.validateDrugExists(value);
    };

    return {
      input: {
        async: [
          CustomValidators.async.termExistsInDatabase(
            getHasDrugFn.bind(this.searchService),
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

  lookupTypeaheadTerms(value: string) {
    const sliceString = (item: string) => [
      value,
      item.slice(value.length, -2),
      item.slice(-2),
    ];
    if (!value || value.length <= 1) {
      return [];
    } else if (value.length > 1) {
      return this.searchService.filterTypeahead(value).map(sliceString);
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

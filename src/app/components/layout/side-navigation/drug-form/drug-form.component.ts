import { CdkPortal, ComponentPortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import {
  AsyncValidatorFn,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { matFormFieldAnimations } from '@angular/material/form-field';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, take, takeUntil } from 'rxjs/operators';

import { TypeaheadState } from '../../../../interfaces/TypeaheadState';
import { DataService } from '../../../../services/data.service';
import { destroy } from '../../../../services/destroy';
import { ResizeService } from '../../../../services/resize.service';
import { SearchService } from '../../../../services/search.service';
import { CustomValidators } from '../../../../validators/index.validators';
import { ErrorMessageComponent } from '../../../error-message/error-message.component';
import { drugFormAnimations } from './drug-form.animations';

const TYPEAHEAD_INITIAL_STATE = {
  pending: false,
  open: false,
  length: 0,
  data: [],
  edit: false,
};
type DrugFormControls = {
  drugList: string[];
  drugInput: string;
};
@Component({
  selector: 'elder-drug-form',
  templateUrl: './drug-form.component.html',
  styleUrls: [
    './drug-form.component.scss',
    './edit-list.drug-form.component.scss',
    './icons.drug-form.component.scss',
  ],
  animations: [
    matFormFieldAnimations.transitionMessages,
    drugFormAnimations.shiftEditList('shiftEditList', '-14px'),
    drugFormAnimations.expandAutocomplete('expandAutocomplete'),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrugFormComponent implements OnDestroy, AfterViewInit {
  @Output('searching') searchEmitter: EventEmitter<boolean> = new EventEmitter();
  @ViewChildren('errors') errorTemplates: QueryList<TemplateRef<unknown>>;
  @ViewChildren(MatAutocompleteTrigger)
  typeaheadTriggers: QueryList<MatAutocompleteTrigger>;
  @ViewChild(CdkPortal, { read: TemplateRef })
  errors: TemplateRef<ErrorMessageComponent>;
  private destroySource = new Subject() as Subject<boolean>;
  destroy$ = this.destroySource.asObservable().pipe(take(1));
  private focusSource = new BehaviorSubject({ focused: false, control: -1 });
  formControlFocused$ = this.focusSource.asObservable().pipe(
    takeUntil(this.destroy$),
    map((c) => c.focused)
  );
  searchInProgress$: Observable<boolean>;
  mobile$: Observable<boolean>;
  private typeaheadSource: BehaviorSubject<TypeaheadState> = new BehaviorSubject(
    TYPEAHEAD_INITIAL_STATE
  );
  typeaheadState$: Observable<TypeaheadState> = this.typeaheadSource.asObservable();
  private pinSearchSource = new BehaviorSubject(false);
  pinSearch$ = this.pinSearchSource.asObservable();
  errorMessages: Record<string, string> = {
    duplicate: `Drug has already been entered.`,
    minlength: `Drug names must be at least 3 characters long.`,
    maxlength: ` Drug names should be fewer than 70 characters.`,
    pattern: `Drug names should only contain alphanumeric letters.`,
  };
  warningMessages: Record<string, string> = {
    termabsent: `Only drugs from the dropdown menu have guidance.`,
  };
  errorPortal: ComponentPortal<ErrorMessageComponent>;
  drugTermAbsent: Observable<ValidationErrors>;
  currentOptions: Set<string> = new Set();
  drugsGroup: FormGroup;
  ngOnDestroy() {
    this.destroySource.next(true);
  }
  ngOnInit() {
    this.drugList.controls = this.searchService.history.map((v) => new FormControl(v));
  }
  ngAfterViewInit() {
    const searchObservers = [
      this.formControlFocused$,
      this.typeaheadState$.pipe(map((s) => s.length === 0)),
    ];
    this.createSearchProgressObserver(searchObservers).subscribe((result) =>
      this.pinSearchSource.next(result)
    );
    this.pinSearch$.subscribe((pinned) => this.searchEmitter.emit(pinned));
  }

  unpinSearch() {
    this.pinSearchSource.next(false);
  }
  constructor(
    public size: ResizeService,
    public database: DataService,
    private searchService: SearchService,
    private form: FormBuilder,
    public dialog: MatDialog,
    public viewRef: ViewContainerRef
  ) {
    this.searchEmitter.emit(false);
    const { input, array } = this.getTermValidators(),
      controls = {
        drugInput: new FormControl('', input.sync, input.async),
        drugList: new FormArray([], array.sync, array.async),
      };
    this.drugsGroup = this.form.group(controls, { updateOn: 'change' });
    const getCurrentQueries = function () {
      return this.drugList.value ?? [];
    };
    this.drugInput.addValidators(CustomValidators.sync.uniqueTerms(getCurrentQueries.bind(this)));
    this.watchHistory().subscribe((queries: string[]) => this.searchService.storeHistory(queries));
    this.watchTypeaheadInput().subscribe((queryResult) => this.updateTypeahead(queryResult));
    this.watchInputState('PENDING').subscribe((pending) => this.updateTypeahead({ pending }));
  }

  createSearchProgressObserver([inputFocused, inputEmpty]: Observable<boolean>[]) {
    return combineLatest([inputFocused, inputEmpty]).pipe(
      debounceTime(100),
      destroy(this),
      filter(([focus, empty]) => {
        return (focus && !empty) || (empty && !focus);
      }),
      map(([focus, _]) => focus),
      distinctUntilChanged()
    );
  }
  private watchHistory(): Observable<unknown> {
    return this.drugList.valueChanges.pipe(debounceTime(100), destroy(this));
  }

  private watchTypeaheadInput() {
    return this.drugsGroup.valueChanges.pipe(
      debounceTime(10),
      destroy(this),
      map(({ drugList, drugInput }: DrugFormControls) => {
        const input = this.activeControl > -1 ? drugList[this.activeControl] : drugInput;
        return this.lookupTypeaheadTerms(input);
      }),
      filter((data) => Array.isArray(data)),
      map((data: string[][]) => ({
        data,
        length: data.length,
        open: length > 0,
      }))
    );
  }
  private watchInputState(state: string): Observable<boolean> {
    return this.drugInput.statusChanges.pipe(
      debounceTime(10),
      destroy(this),
      map((inputState: string) => inputState === state),
      distinctUntilChanged()
    );
  }

  getTooltipText(tooltip: string) {
    return this.drugInput.valid ? 'Add drug to search' : 'Choose a drug from the dropdown';
  }
  setFocusStatus($event, activeInput: number) {
    this.focusSource.next({ focused: $event != null, control: activeInput });
  }
  get activeControl() {
    return this.focusSource.value.control;
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
  get drugInputIsEmpty(): boolean {
    return this.drugInput.value.length === 0;
  }
  get drugListIsEmpty(): boolean {
    return this.drugList.value.length === 0;
  }
  getDrugInputErrors() {
    this.drugInput.invalid;
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
    if (
      this.activeControl === -1 &&
      this.drugList.errors === null &&
      this.drugInput.errors === null
    ) {
      this.drugInput.setValue(option.value);
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
          CustomValidators.async.termExistsInDatabase(getHasDrugFn.bind(this.searchService), 300),
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

  lookupTypeaheadTerms(value: string): string[][] | false {
    const sliceTypeAndMatchingText = (item: string) => [
      value,
      item.slice(value.length, -2),
      item.slice(-2),
    ];
    if (value?.length <= 1) {
      return [];
    } else {
      let results = this.searchService.filterTypeahead(value).slice(0, 10);
      if (
        results.length != this.currentOptions.size ||
        results.some((value) => !this.currentOptions.has(value))
      ) {
        this.currentOptions.clear();
        results.forEach((v) => this.currentOptions.add(value));
        return results.map(sliceTypeAndMatchingText);
      } else {
        return false;
      }
    }
  }

  updateTypeahead(state: Partial<TypeaheadState>) {
    this.typeaheadSource.next(Object.assign(this.typeaheadSource.value, state));
    console.log(state);
  }
}

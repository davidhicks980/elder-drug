import { FocusMonitor } from '@angular/cdk/a11y';
import { CdkPortal, ComponentPortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  OnDestroy,
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
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, skip, take } from 'rxjs/operators';

import { TypeaheadState } from '../../interfaces/TypeaheadState';
import { DataService } from '../../services/data.service';
import { destroy } from '../../functions/destroy';
import { LayoutService } from '../../services/layout.service';
import { SearchService } from '../../services/search.service';
import { CustomValidators } from '../../validators/validators';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { errorValidationMessages, warningValidationMessages } from './validation-messages';

const TYPEAHEAD_INITIAL_STATE = {
  pending: false,
  open: false,
  length: 0,
  data: [],
  edit: false,
} as TypeaheadState;
type DrugFormControls = {
  drugList: string[];
  drugInput: string;
};

const sliceTypeAndMatchingText = (entry: string) => (item: string) =>
  [entry, item.slice(entry.length, -2), item.slice(-2)];
@Component({
  selector: 'elder-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss', './edit-search-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFormComponent implements OnDestroy, AfterViewInit {
  inputValid$: Observable<boolean>;
  @HostBinding('class.is-pinned') get searchIsPinned() {
    return this.layoutService.isSearchPinned && this.layoutService.isMobile;
  }
  @ViewChildren('errors') errorTemplates: QueryList<TemplateRef<unknown>>;
  @ViewChild('searchInput') drugInputReference: ElementRef<HTMLInputElement>;
  @ViewChildren(MatAutocompleteTrigger) typeaheadTriggers: QueryList<MatAutocompleteTrigger>;
  @ViewChild(CdkPortal, { read: TemplateRef }) errors: TemplateRef<ErrorMessageComponent>;
  private focusSource = new BehaviorSubject({ focused: false, control: -1 });
  private typeaheadSource = new BehaviorSubject(TYPEAHEAD_INITIAL_STATE);
  destroy$: Subject<boolean> = new Subject();
  controlFocus$ = this.focusSource.asObservable().pipe(
    destroy(this),
    map((c) => c.focused)
  );
  typeaheadState$: Observable<TypeaheadState> = this.typeaheadSource.asObservable();
  termExists$: Observable<ValidationErrors>;
  private uniqueSearchSource = new BehaviorSubject(false);
  uniqueSearch$ = this.uniqueSearchSource.asObservable();
  errorPortal: ComponentPortal<ErrorMessageComponent>;
  errorMessages = errorValidationMessages;
  warningMessages = warningValidationMessages;
  currentOptions: Set<string> = new Set();
  drugsGroup: FormGroup;

  get focusedControl() {
    return this.focusSource.value.control;
  }

  get drugList(): FormArray {
    return this.drugsGroup.get('drugList') as FormArray;
  }

  get drugInput(): FormControl {
    return this.drugsGroup.get('drugInput') as FormControl;
  }

  get uniqueItemValidator() {
    const getCurrentQueries = function () {
      return this.drugList.value || [];
    };
    return CustomValidators.sync.uniqueArrayTerm(getCurrentQueries.bind(this));
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }
  buildListControls(controls: string[]): FormControl[] {
    return controls.map(
      (control) =>
        new FormControl(
          control,
          this.getTermValidators().input.sync,
          this.getTermValidators().input.async
        )
    );
  }
  buildForm() {
    let { input, array } = this.getTermValidators();
    let controls = {
      drugInput: new FormControl('', input.sync, input.async),
      drugList: new FormArray([], array.sync, array.async),
    };

    this.drugsGroup = this.form.group(controls, { updateOn: 'change' });
    let getCurrentQueries = function () {
      return this.drugList.value || [];
    };
    let uniqueTermValidator = CustomValidators.sync.uniqueTerms(getCurrentQueries.bind(this));
    this.drugInput.addValidators(uniqueTermValidator);
    this.drugsGroup.updateValueAndValidity();
  }

  ngOnInit() {
    this.buildForm();
    this.searchService.searchResults$.subscribe(({ terms }) => {
      let listValue = this.drugList.getRawValue();
      if (terms.length != listValue.length || terms.some((term) => !listValue.includes(term))) {
        this.drugList.clear();
        this.buildListControls(terms).forEach((control) => this.drugList.push(control));
      }
    });
    let history = this.searchService.history;
    if (history?.length > 0) {
      this.drugList.clear();
      this.buildListControls(history).forEach((control) => this.drugList.push(control));
    }
    this.watchHistory().subscribe((queries: string[]) => this.searchService.storeHistory(queries));
    this.searchService.history$.pipe(destroy(this), skip(1), take(1)).subscribe((val) => {
      this.uniqueSearchSource.next(true);
    });
    this.watchTypeaheadInput().subscribe((queryResult) => this.updateTypeaheadState(queryResult));
    this.watchInputState('PENDING').subscribe((pending) => this.updateTypeaheadState({ pending }));
  }

  ngAfterViewInit() {
    this.determineInitialFocus();
  }

  constructor(
    public layoutService: LayoutService,
    public database: DataService,
    private searchService: SearchService,
    private form: FormBuilder,
    public viewRef: ViewContainerRef,
    public focusMonitor: FocusMonitor
  ) {}

  private determineInitialFocus() {
    if (this.layoutService.isMobile) {
      if (!this.layoutService.isSearchPinned) {
        this.focusSource.subscribe(({ focused, control }) => {
          if (focused && control === -1) {
            this.layoutService.togglePinnedSearchbar(true);
          }
        });
      } else {
        this.focusSearchInput();
      }
    }
  }

  private watchHistory(): Observable<unknown> {
    return this.drugList.valueChanges.pipe(destroy(this), debounceTime(30));
  }

  private watchTypeaheadInput() {
    return this.drugsGroup.valueChanges.pipe(
      destroy(this),
      debounceTime(30),
      map(({ drugList, drugInput }: DrugFormControls) => {
        return this.focusedControl > -1 ? drugList[this.focusedControl] : drugInput;
      }),
      map((input) => this.lookupTypeaheadTerms(input)),
      map((data: string[][]) => ({
        data,
        length: data.length,
        open: length > 0,
      }))
    );
  }
  private watchInputState(state: string): Observable<boolean> {
    return this.drugInput.statusChanges.pipe(
      destroy(this),
      debounceTime(10),
      map((inputState: string) => inputState === state),
      distinctUntilChanged()
    );
  }

  setFocusStatus($event, activeInput: number) {
    this.focusSource.next({ focused: $event != null, control: activeInput });
  }

  search($event?: Event, includeInput: boolean = false) {
    $event?.preventDefault();
    if (includeInput) {
      this.addListControl();
    }
    let search = [...this.drugList.value];
    if (search?.length > 0) {
      this.searchService.searchTerms(search);
      this.layoutService.toggleSidenav();
    }
  }

  chooseTerm({ option }: MatAutocompleteSelectedEvent) {
    if (
      this.focusedControl === -1 &&
      this.drugList.errors === null &&
      this.drugInput.errors === null
    ) {
      this.drugInput.setValue(option.value);
      this.addListControl();
    }
  }

  getTermValidators(this: SearchFormComponent): {
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
  clearSearchTerms($event: Event) {
    $event.preventDefault();
    this.searchService.storeHistory([]);
    this.drugList.clear();
  }

  addListControl() {
    const { sync, async } = this.getTermValidators().input;
    const newEditableInput = new FormControl(
      this.drugInput.value,
      [...sync, this.uniqueItemValidator],
      async
    );
    this.drugList.push(newEditableInput);
    this.drugsGroup.updateValueAndValidity();
    requestAnimationFrame(() => {
      this.drugInput.setValue('');
    });
  }

  deleteListControl(index: number) {
    return this.drugList.removeAt(index);
  }

  getListControl(index: number) {
    return this.drugList.controls[index];
  }

  lookupTypeaheadTerms(input: string): string[][] {
    if (!input?.length) {
      return [];
    } else {
      let entry = input.toLowerCase();
      let results = this.searchService.filterTypeahead(entry).slice(0, 10);
      if (
        results.length != this.currentOptions.size ||
        results.some((value) => !this.currentOptions.has(value))
      ) {
        this.currentOptions.clear();
        results.forEach((v) => this.currentOptions.add(entry));
        return results.map(sliceTypeAndMatchingText(entry));
      } else {
        return [];
      }
    }
  }
  focusSearchInput() {
    requestAnimationFrame(() => {
      this.focusMonitor.focusVia(this.drugInputReference?.nativeElement, 'keyboard');
    });
  }
  updateTypeaheadState(state: Partial<TypeaheadState>) {
    this.typeaheadSource.next(Object.assign(this.typeaheadSource.value, state));
  }
}

/*
@Component({
  selector: 'elder-column-selector',
  template: `<mat-form-field color="primary" *ngIf="selectOptions">
    <mat-label>Change Columns</mat-label>
    <mat-select
      #columnSelect
      class="column-select"
      multiple
      [ngModel]="selectOptions"
      (ngModelChange)="emitUpdatedColumns($event)"
    >
      <mat-option
        *ngFor="let column of displayedOptions | async"
        [value]="column"
      >
        {{ column | caseSplit }}
      </mat-option>
    </mat-select>
  </mat-form-field> `,
  styleUrls: ['./column-selector.component.scss'],
})
export class ColumnSelectorComponent implements AfterViewInit {
  @ViewChild('columnSelect') selector: MatSelectChange;
  @Input() tableName: number;
  @Output() columnUpdates: EventEmitter<string[]> = new EventEmitter();
  @Output() loaded = new EventEmitter();
  displayedOptions: Observable<string[]>;
  selectOptions: string[];
  selectedOptions: Observable<string[]>;

  emitUpdatedColumns(cols) {
    this.columnUpdates.emit(cols);
  }
  ngAfterViewInit() {
    this.selectedOptions.subscribe((item) => (this.selectOptions = item));
    this.loaded.emit(true);
  }
  ngOnInit() {
    const options = this.firebase.filteredFields$.pipe(
      filter((item: any) => item.id === this.tableName)
    );
    this.displayedOptions = options.pipe(pluck('fields'));
    this.selectedOptions = options.pipe(pluck('selected'));
  }
  constructor(
    private columnService: ColumnService,
    public firebase: FirebaseService
  ) {
    this.columnService = columnService;
  }
}
*/

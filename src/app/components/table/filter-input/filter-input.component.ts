import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { FilterService } from '../../../services/filter.service';

@Component({
  selector: 'elder-filter-input',
  templateUrl: './filter-input.component.html',
  styleUrls: ['./filter-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterInputComponent {
  @Output() filter: EventEmitter<string> = new EventEmitter();
  @Input() hideLabel: boolean = false;
  emitFilter($event: string) {
    this.filter.emit($event);
  }
  ngOnDestroy() {
    this.filter.complete();
  }
  constructor(private filterService: FilterService) {
    this.filter.subscribe((value: string) => this.filterService.updateFilter(value));
  }
}

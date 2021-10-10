import { Component, Input } from '@angular/core';

import { ColumnService } from '../../../services/columns.service';
import { FilterService } from '../../../services/filter.service';
import { GroupByService } from '../../../services/group-by.service';
import { TableService } from '../../../services/table.service';

@Component({
  selector: 'elder-table-card',
  templateUrl: './table-card.component.html',
  styleUrls: ['./table-card.component.scss'],
  providers: [GroupByService, ColumnService, FilterService],
})
export class TableCardComponent {
  @Input() icon: string;
  constructor(
    private columnService: ColumnService,
    private groupService: GroupByService,
    private tableService: TableService,
    private filterService: FilterService
  ) {}
}

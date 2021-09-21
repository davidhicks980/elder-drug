import { Component } from '@angular/core';
import { map, switchMap, take } from 'rxjs/operators';

import { ColumnService } from '../../../services/columns.service';
import { GroupByService } from '../../../services/group-by.service';
import { TableService } from '../../../services/table.service';

@Component({
  selector: 'elder-table-card',
  templateUrl: './table-card.component.html',
  styleUrls: ['./table-card.component.scss'],
  providers: [GroupByService, ColumnService],
})
export class TableCardComponent {
  formatGroupNames(name: string) {
    return name?.replace(/([A-Z])/g, ' $1').trim() || '';
  }
  constructor(
    private columnService: ColumnService,
    private groupService: GroupByService,
    private tableService: TableService
  ) {
    this.tableService.selection$
      .pipe(
        switchMap(() =>
          this.columnService.columns$.pipe(
            take(1),
            map((columns) => columns.map(this.formatGroupNames))
          )
        )
      )
      .subscribe((groups) => this.groupService.addItems(groups, [], true));
    this.tableService.selection$.subscribe((table) => {
      this.columnService.changeTable(table);
    });
  }
}

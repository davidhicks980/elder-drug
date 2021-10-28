import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { ColumnService } from '../../services/columns.service';
import { destroy } from '../../functions/destroy';
import { FilterService } from '../../services/filter.service';
import { GroupByService } from '../../services/group-by.service';
import { TableService } from '../../services/table.service';

@Component({
  selector: 'elder-table-container',
  templateUrl: './table-container.component.html',
  styleUrls: ['./table-container.component.scss'],
  providers: [GroupByService, ColumnService, FilterService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableContainerComponent implements OnDestroy {
  @Input() icon: string;

  previousTable: number = -1;
  transitions: { forwards: Animation; reverse: Animation };
  destroy$ = new Subject();
  private buildAnimations(distance: string): Animation {
    return new Animation(
      new KeyframeEffect(
        this.element.nativeElement,
        [
          { transform: `translateX(${distance})`, opacity: '0' },
          { transform: `translateX(0px)`, opacity: '1' },
        ],
        { duration: 175, easing: 'ease-in-out' }
      ),
      document.timeline
    );
  }
  ngAfterViewInit() {
    this.transitions = {
      forwards: this.buildAnimations('20px'),
      reverse: this.buildAnimations('-20px'),
    };

    this.tableService.selection$.pipe(destroy(this), distinctUntilChanged()).subscribe((table) => {
      let { tableNumber } = table;
      if (this.previousTable != tableNumber) {
        this.transitions[this.previousTable < tableNumber ? 'forwards' : 'reverse'].play();
        this.previousTable = tableNumber;
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }
  constructor(
    private columnService: ColumnService,
    private groupService: GroupByService,
    private tableService: TableService,
    private element: ElementRef<HTMLElement>
  ) {}
}

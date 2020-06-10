import { Component, Input, OnChanges } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTableDataSource } from '@angular/material/table';
import { BeersEntry } from '../websocket.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-med-table',
  templateUrl: './med-table.component.html',
  styleUrls: ['./med-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed, void=>expanded',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class MedTableComponent implements OnChanges {
  @Input() data: any;
  @Input() displayedColumns: string[];
  @Input() selectedColumns: string[];
  @Input() name: string;
  @Input() toggleOptions: string[];
  expandedMeds;
  dataSource: MatTableDataSource<BeersEntry>;

  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.data);
    console.log(this.dataSource);
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.selectedColumns,
      event.previousIndex,
      event.currentIndex
    );
  }
}

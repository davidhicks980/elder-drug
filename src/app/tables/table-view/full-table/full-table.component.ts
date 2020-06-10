import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { WebsocketService, BeersEntry } from 'src/app/websocket.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-full-table',
  templateUrl: './full-table.component.html',
  styleUrls: ['./full-table.component.scss'],
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
export class FullTableComponent implements AfterViewInit {
  queriedMeds: any[];
  dataSource;
  /* Displayable Columns
  columnsToDisplay = [
    `EntryID`,
    `DiseaseState`,
    `Table`,
    `Class`,
    `MinimumClearance`,
    `MaximumClearance`,
    `Interaction`,
    `Inclusion`,
    `Exclusion`,
    `Rationale`,
    `Recommendation`,
    `RecommendationLineTwo`,
  ];
  */
  expandedMeds;
  selectedColumns: any[] = ['SearchTerm', 'Item', 'Category'];
  displayedColumns;
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.selectedColumns,
      event.previousIndex,
      event.currentIndex
    );
  }

  constructor(public webSocketService: WebsocketService) {}
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<BeersEntry>();

    this.webSocketService.listen('search-results').subscribe((data: any[]) => {
      this.queriedMeds = this.webSocketService.mapData(data, null);
      this.dataSource = new MatTableDataSource(this.queriedMeds);
      this.dataSource.sort = this.sort;
    });
  }
}

import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { WebsocketService, BeersEntry } from 'src/app/websocket.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-disease-table',
  templateUrl: './disease-table.component.html',
  styleUrls: ['./disease-table.component.scss'],
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
export class DiseaseTableComponent implements AfterViewInit {
  queriedMeds: any[];
  diseaseStates: string[];
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
  selectedColumns: any[];
  arrayOfDiseaseStates: string[];
  rawData: MatTableDataSource<any>;
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
      let outarray = [];
      this.queriedMeds = this.webSocketService.mapData(data, 'DiseaseState');
      console.log(this.queriedMeds);
      this.rawData = new MatTableDataSource(this.queriedMeds);
      this.dataSource.sort = this.rawData.sort;
      for (let item of this.queriedMeds) {
        outarray.push(item.DiseaseState);
      }
      this.arrayOfDiseaseStates = [...new Set(outarray)].filter((item) => item);
    });
  }
}

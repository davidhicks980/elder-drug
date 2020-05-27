import { Component, OnInit } from '@angular/core';
import { WebsocketService } from 'src/app/websocket.service';
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
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class DiseaseTableComponent {
  queriedData: any[];

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

  constructor(public webSocketService: WebsocketService) {
    this.webSocketService.listen('search-results').subscribe((data: any[]) => {
      this.queriedData = data;
    });
  }
}
export interface BeersEntry {
  EntryID: number;
  DiseaseState: string;
  Table: number;
  Class: string;
  MinimumClearance: number;
  MaximumClearance: number;
  Interaction: string;
  Inclusion: string;
  Exclusion: string;
  Rationale: string;
  Recommendation: string;
  RecommendationLineTwo: string;
}

import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../../websocket.service';

@Component({
  selector: 'app-clearance-table',
  templateUrl: './clearance-table.component.html',
  styleUrls: ['./clearance-table.component.scss'],
})
export class ClearanceTableComponent {
  queriedData: any[];
  constructor(public webSocketService: WebsocketService) {
    this.webSocketService.listen('search-results').subscribe((data: any[]) => {
      this.queriedData = data;
      console.log(this.queriedData);
    });
  }
}

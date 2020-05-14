import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../websocket.service';

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.scss'],
})
export class TableViewComponent {
  queriedData: any[];
  constructor(public webSocketService: WebsocketService) {
    this.webSocketService.listen('search-results').subscribe((data: any[]) => {
      this.queriedData = data;
      console.log(this.queriedData);
    });
  }
}

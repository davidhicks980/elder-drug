import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../websocket.service';

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.scss'],
})
export class TableViewComponent {
  tiles: Tile[] = [
    { text: 'One', cols: 3, rows: 3, color: 'lightblue' },
    { text: 'Two', cols: 1, rows: 2, color: 'lightgreen' },
  ];
  constructor() {}
}

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

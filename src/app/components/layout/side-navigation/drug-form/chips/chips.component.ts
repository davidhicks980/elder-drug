import { Component } from '@angular/core';

export interface Drug {
  id: string;
  name: string;
}
@Component({
  selector: 'elder-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
})
export class ChipsComponent {
  constructor() {}
}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'elder-group-row',
  templateUrl: './group-row.component.html',
  styleUrls: ['./group-row.component.scss'],
})
export class GroupRowComponent {
  @Input('header') groupHeader: string = '';
  @Input('field') field: string = '';
  @Input('level') level: number = 0;
  constructor() {}
}

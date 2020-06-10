import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-column-selector',
  templateUrl: './column-selector.component.html',
  styleUrls: ['./column-selector.component.scss'],
})
export class ColumnSelectorComponent implements OnInit {
  @Input() displayed: string[];
  @Input() selected: string[];
  constructor() {}

  ngOnInit(): void {}
}

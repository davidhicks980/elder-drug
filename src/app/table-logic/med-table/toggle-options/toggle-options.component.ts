import { Component, Input, Output } from '@angular/core';

@Component({
  selector: 'app-toggle-options',
  templateUrl: './toggle-options.component.html',
  styleUrls: ['./toggle-options.component.scss'],
})
export class ToggleOptionsComponent {
  @Input() keys: string[];
  @Output() buttonSelection: string;
  options: string[];

  constructor() {}

  updateOptions(selection) {
    const outArray = [];
    for (const item of this.options) {
      outArray.push(item[String(selection)]);
      this.options = [...new Set(outArray)].filter((item) => item);
    }
  }
}

import { Component, OnInit, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'app-toggle-options',
  templateUrl: './toggle-options.component.html',
  styleUrls: ['./toggle-options.component.scss'],
})
export class ToggleOptionsComponent implements OnChanges {
  @Input() keys: string[];
  @Output() buttonSelection: string;
  options: string[];
  getVal(val) {
    console.log(val);
  }

  constructor() {}

  updateOptions(selection) {
    let outArray = [];
    for (let item of this.options) {
      outArray.push(item[String(selection)]);
      this.options = [...new Set(outArray)].filter((item) => item);
    }
  }
  ngOnChanges() {
    this.getVal(this.keys);
  }
}

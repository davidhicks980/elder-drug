import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { MatButtonToggle } from '@angular/material/button-toggle';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  @Output() toggleDrawer = new EventEmitter<boolean>();
  @Input() navToggled: boolean = true;
  addNewItem(value: string) {}
  iconName: string = 'menu';
  openDrawer() {
    this.toggleDrawer.emit();
  }

  constructor() {}

  ngOnInit(): void {}
}

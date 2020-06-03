import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatButtonToggle } from '@angular/material/button-toggle';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  @ViewChild('drawer-button') toggleDrawer: MatButtonToggle;
  @Output() pullDrawer = new EventEmitter<boolean>();
  navToggled: boolean = true;
  addNewItem(value: string) {}
  iconName: string = 'menu';
  openDrawer() {
    this.navToggled = !this.navToggled;
    this.iconName = this.navToggled === true ? 'chevron_left' : 'menu';
    this.pullDrawer.emit();
  }

  constructor() {}

  ngOnInit(): void {}
}

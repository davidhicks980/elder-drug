import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatButtonToggle } from '@angular/material/button-toggle';

@Component({
  selector: 'app-bottom-navigation',
  templateUrl: './bottom-navigation.component.html',
  styleUrls: ['./bottom-navigation.component.scss'],
})
export class BottomNavigationComponent implements OnInit {
  @Output() smallPullDrawer = new EventEmitter<boolean>();
  openDrawer() {
    this.smallPullDrawer.emit();
  }

  constructor() {}

  ngOnInit(): void {}
}

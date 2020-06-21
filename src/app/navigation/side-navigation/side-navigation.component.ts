import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.scss'],
})
export class SideNavigationComponent implements OnInit {
  @Input() navToggled: boolean;
  @Input() handsetLayout: boolean;
  @Output() toggleDrawer = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {}
}

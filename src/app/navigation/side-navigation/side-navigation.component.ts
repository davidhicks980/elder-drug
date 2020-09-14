import { Component, OnInit, Input } from '@angular/core';
import { StateService } from 'src/app/state.service';
import { ScreenWidth } from '../../state.service';

@Component({
  selector: 'app-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.scss'],
})
export class SideNavigationComponent implements OnInit {
  sidenavActive: boolean;
  screenSize: ScreenWidth;

  constructor(public state: StateService) {
    state.sidenavStatus$.subscribe((isOpen: boolean) => {
      this.sidenavActive = isOpen;
    });
  }

  ngOnInit(): void {
    this.sidenavActive = this.state.sidenavOpen;
    this.state.windowWidth$.subscribe((screenSize: ScreenWidth) => {
      this.screenSize = screenSize;
    });
  }
}

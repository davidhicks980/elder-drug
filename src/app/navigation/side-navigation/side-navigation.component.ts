import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StateService } from 'src/app/state.service';

@Component({
  selector: 'app-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.scss'],
})
export class SideNavigationComponent implements OnInit {
  sidenavActive: boolean;
  @Input() handsetLayout: boolean;
  constructor(public stateService: StateService) {
    stateService.sidenavStatus$.subscribe((isOpen: boolean) => {
      this.sidenavActive = isOpen;
    });
  }

  ngOnInit(): void {
    this.sidenavActive = this.stateService.sidenavOpen;
  }
}

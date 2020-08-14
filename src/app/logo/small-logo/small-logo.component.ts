import { Component, OnInit, Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { StateService } from 'src/app/state.service';

@Component({
  selector: 'app-small-logo',
  templateUrl: './small-logo.component.html',
  styleUrls: ['./small-logo.component.scss'],
  animations: [
    trigger('openClose', [
      // ...
      state(
        'open',
        style({
          width: '0px',
          opacity: 0.01,
        })
      ),
      state(
        'closed',
        style({
          width: '3.5em',
          opacity: 1,
        })
      ),
      transition('open => closed', [animate('0.3s ease-out')]),
      transition('closed => open', [animate('0.2s ease-in')]),
    ]),
  ],
})
export class SmallLogoComponent {
  sidenavToggled: boolean;

  ngOnInit() {
    this.sidenavToggled = this.stateService.sidenavOpen;
  }
  constructor(public stateService: StateService) {
    this.stateService.sidenavStatus$.subscribe((toggled) => {
      this.sidenavToggled = toggled;
    });
  }
}

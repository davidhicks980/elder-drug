import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';

import { LayoutStatus, ResizeService, ScreenStatus } from '../../../../services/resize.service';

@Component({
  selector: 'elder-logo',
  templateUrl: './logo-component.html',
  styleUrls: ['./logo.component.scss'],
  animations: [
    trigger('openClose', [
      transition(':leave', [
        style({
          width: '3.5em',
          opacity: 1,
        }),
        animate(
          '0.3s ease-out',
          style({
            opacity: 0,
            width: '0em',
          })
        ),
      ]),
    ]),
  ],
})
export class LogoComponent {
  // show defines whether the logo should be shown
  // alt defines whether the alternative palette should be used
  @Input() altColor = false;
  @Input() title = false;
  public showLogo = true;
  @Input() contentPlaceholder = false;
  screenSize: ScreenStatus;
  layout: LayoutStatus;

  checkLogoStatus() {
    if (!this.title) {
      if (this.layout.screenWidth != 3 || !this.layout.sidenavOpen) {
        this.showLogo = true;
      } else {
        this.showLogo = false;
      }
    }
  }

  constructor(public resizer: ResizeService) {
    this.resizer.windowWidth$.subscribe((layoutStatus: LayoutStatus): void => {
      this.layout = layoutStatus;
    });
  }
}

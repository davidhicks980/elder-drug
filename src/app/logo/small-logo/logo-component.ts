import { Component, Input } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { StateService, ScreenWidth } from '../../state.service';

@Component({
  selector: 'app-logo',
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
  public drawerOpened: boolean;
  public showLogo = true;
  @Input() contentPlaceholder = false;
  screenSize: ScreenWidth;

  checkLogoStatus() {
    if (!this.title) {
      if (this.screenSize != 'LARGE' || !this.drawerOpened) {
        this.showLogo = true;
      } else {
        this.showLogo = false;
      }
    }
  }

  constructor(public stateService: StateService) {
    this.stateService.windowWidth$.subscribe((screenSize: ScreenWidth) => {
      this.screenSize = screenSize;
      this.checkLogoStatus();
    });

    stateService.sidenavStatus$.subscribe((isOpen: boolean) => {
      this.drawerOpened = isOpen;
      this.checkLogoStatus();
    });
  }
}

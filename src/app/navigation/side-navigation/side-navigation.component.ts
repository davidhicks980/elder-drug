import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { StateService } from 'src/app/state.service';

import { LayoutStatus, ScreenStatus } from '../../state.service';

@Component({
  selector: 'app-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.scss'],
})
export class SideNavigationComponent {
  sidenavActive: boolean;
  screenSize: ScreenStatus;
  layout: LayoutStatus;
  sidenavOpen: boolean;

  constructor(
    public state: StateService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.state.windowWidth$.subscribe((layoutStatus: LayoutStatus): void => {
      this.layout = layoutStatus;
      this.sidenavOpen = this.layout.sidenavOpen;
    });
    iconRegistry.addSvgIcon(
      'search',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/search.svg')
    );
  }
}

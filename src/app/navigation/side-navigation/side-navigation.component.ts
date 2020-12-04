import { Component, OnInit } from '@angular/core';
import { StateService } from 'src/app/state.service';
import { ScreenStatus, LayoutStatus } from '../../state.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.scss'],
})
export class SideNavigationComponent {
  sidenavActive: boolean;
  screenSize: ScreenStatus;
  layout: LayoutStatus;

  constructor(
    public state: StateService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.state.windowWidth$.subscribe((layoutStatus: LayoutStatus): void => {
      this.layout = layoutStatus;
    });
    iconRegistry.addSvgIcon(
      'search',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/search.svg')
    );
  }
}

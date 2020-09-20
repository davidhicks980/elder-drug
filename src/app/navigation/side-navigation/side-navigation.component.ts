import { Component, OnInit } from '@angular/core';
import { StateService } from 'src/app/state.service';
import { ScreenWidth } from '../../state.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.scss'],
})
export class SideNavigationComponent implements OnInit {
  sidenavActive: boolean;
  screenSize: ScreenWidth;

  constructor(
    public state: StateService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    state.sidenavStatus$.subscribe((isOpen: boolean) => {
      this.sidenavActive = isOpen;
    });
    iconRegistry.addSvgIcon(
      'arrow_forward.svg',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/arrow_forward.svg'
      )
    );
  }

  ngOnInit(): void {
    this.sidenavActive = this.state.sidenavOpen;
    this.state.windowWidth$.subscribe((screenSize: ScreenWidth) => {
      this.screenSize = screenSize;
    });
  }
}

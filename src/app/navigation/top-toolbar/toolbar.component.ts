import { Component, Input, OnInit } from '@angular/core';
import { StateService } from 'src/app/state.service';
import { dropInAnimation, toolbarButtonAnimation } from '../../animations';
import { MatDialog } from '@angular/material/dialog';
import { WebsocketService } from '../../websocket.service';
import { ScreenWidth } from '../../state.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  animations: [dropInAnimation, toolbarButtonAnimation],
})
export class ToolbarComponent {
  sidenavActive: boolean = true;
  public iconName = 'menu';
  @Input() loaded = false;
  screenSize: ScreenWidth;

  constructor(
    public fire: WebsocketService,
    public state: StateService,
    public dialog: MatDialog,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    state.windowWidth$.subscribe((screenSize: ScreenWidth) => {
      this.screenSize = screenSize;
    });
    this.state.sidenavStatus$.subscribe((isOpen: boolean) => {
      this.sidenavActive = isOpen;
    });
    iconRegistry.addSvgIcon(
      'menu.svg',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/menu.svg')
    );
    iconRegistry.addSvgIcon(
      'chevron_left.svg',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/chevron_left.svg'
      )
    );
  }

  openDisclaimerDialog() {
    this.dialog.open(DisclaimerComponent, { width: '700px' });
  }
  openAboutDialog() {
    this.dialog.open(AboutComponent, { width: '700px' });
  }
}

@Component({
  selector: 'disclaimer-component',
  templateUrl: './disclaimer.html',
})
export class DisclaimerComponent {}

@Component({
  selector: 'about-component',
  templateUrl: './about.html',
})
export class AboutComponent {}

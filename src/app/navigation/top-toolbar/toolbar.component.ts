import { Component, Input, OnInit } from '@angular/core';
import { StateService } from 'src/app/state.service';
import { MatDialog } from '@angular/material/dialog';
import { WebsocketService } from '../../websocket.service';
import { ScreenStatus, LayoutStatus } from '../../state.service';
import { toolbarItemsFade } from '../../animations';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  animations: [toolbarItemsFade],
})
export class ToolbarComponent {
  public iconName = 'menu';
  @Input() loaded = false;
  screenSize: ScreenStatus;
  shrinkHeader: boolean;
  layout: LayoutStatus;
  sidenavOpenMobileWidth: boolean;
  constructor(
    public fire: WebsocketService,
    public state: StateService,
    public dialog: MatDialog
  ) {
    this.state.windowWidth$.subscribe((layoutStatus: LayoutStatus): void => {
      this.layout = layoutStatus;
      this.sidenavOpenMobileWidth =
        this.layout.sidenavOpen && this.layout.mobileWidth;
    });
  }

  openDisclaimerDialog() {
    this.dialog.open(DisclaimerComponent, { width: '700px' });
  }
  openAboutDialog() {
    this.dialog.open(AboutComponent, { width: '700px' });
  }

  openDesignDialog() {
    this.dialog.open(DesignComponent, { width: '700px' });
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

@Component({
  selector: 'Design-component',
  templateUrl: './design.html',
})
export class DesignComponent {}

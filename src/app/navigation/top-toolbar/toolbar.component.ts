import { Component, Input, OnInit } from '@angular/core';
import { StateService } from 'src/app/state.service';
import { MatDialog } from '@angular/material/dialog';
import { WebsocketService } from '../../websocket.service';
import { ScreenWidth } from '../../state.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  sidenavActive: boolean = true;
  public iconName = 'menu';
  @Input() loaded = false;
  screenSize: ScreenWidth;
  shrinkHeader: boolean;

  constructor(
    public fire: WebsocketService,
    public state: StateService,
    public dialog: MatDialog
  ) {
    state.windowWidth$.subscribe((screenSize: ScreenWidth) => {
      this.screenSize = screenSize;
    });
    this.state.sidenavStatus$.subscribe((isOpen: boolean) => {
      this.sidenavActive = isOpen;
    });
  }
  ngOnInit(): void {
    this.animateHeader();
  }

  animateHeader() {
    window.onscroll = () => {
      if (window.pageYOffset > 120) {
        this.shrinkHeader = true;
      } else {
        this.shrinkHeader = false;
      }
    };
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

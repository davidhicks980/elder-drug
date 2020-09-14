import { Component, Input, OnInit } from '@angular/core';
import { StateService } from 'src/app/state.service';
import { dropInAnimation, fadeInAnimation } from '../../animations';
import { MatDialog } from '@angular/material/dialog';
import { WebsocketService } from '../../websocket.service';
import { ScreenWidth } from '../../state.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  animations: [dropInAnimation],
})
export class ToolbarComponent implements OnInit {
  sidenavActive: boolean;
  public iconName = 'menu';
  @Input() loaded = false;
  screenSize: ScreenWidth;

  ngOnInit() {
    this.state.windowWidth$.subscribe((screenSize: ScreenWidth) => {
      this.screenSize = screenSize;
    });
  }
  constructor(
    public fire: WebsocketService,
    public state: StateService,
    public dialog: MatDialog
  ) {
    state.sidenavStatus$.subscribe((isOpen: boolean) => {
      this.sidenavActive = isOpen;
    });
    this.state.windowWidth$.subscribe((screenSize: ScreenWidth) => {
      this.screenSize = screenSize;
    });
  }

  openDialog() {
    this.dialog.open(DisclaimerComponent, { width: '700px' });
  }
}

@Component({
  selector: 'disclaimer-component',
  templateUrl: './disclaimer.html',
})
export class DisclaimerComponent {}

import { trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { flyInTemplate } from '../../../animations';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'elder-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  animations: [
    trigger(
      'flyIn',
      flyInTemplate(
        {
          startX: '0px',
          startY: '-20%',
          endX: '0px',
          endY: '0px',
          timing: '500ms ease',
        },
        {
          startX: '0px',
          startY: '0px',
          endX: '0px',
          endY: '-100%',
          timing: '300ms ease-in',
        }
      )
    ),
    ,
  ],
})
export class ToolbarComponent {
  public iconName = 'menu';
  constructor(public fire: DataService, public dialog: MatDialog) {}

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

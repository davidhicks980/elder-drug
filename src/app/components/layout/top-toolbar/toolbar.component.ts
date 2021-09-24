import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'elder-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  public iconName = 'menu';
  @Input() scrolled;
  constructor(public dialog: MatDialog) {}

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

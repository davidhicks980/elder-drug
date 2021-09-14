import { Component, ContentChild, Inject, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { TemplateContentDirective } from '../../../directives/content-template.directive';
import { TOOLBAR_TOKENS, ToolbarTokens, toolbarTokens } from './ToolbarTokens';

@Component({
  selector: 'elder-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  providers: [{ provide: TOOLBAR_TOKENS, useValue: toolbarTokens }],
})
export class ToolbarComponent {
  @ContentChild(TemplateContentDirective)
  toggleContent: TemplateContentDirective;

  public iconName = 'menu';
  @Input() scrolled;
  constructor(
    public dialog: MatDialog,
    @Inject(TOOLBAR_TOKENS) private toolbarTokens: ToolbarTokens
  ) {}
  get toggleSlot() {
    if (
      this.toolbarTokens.TOGGLE_TEMPLATE === this.toggleContent.templateContent
    ) {
      return this.toggleContent.templateRef;
    } else {
      return null;
    }
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

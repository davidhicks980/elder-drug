import { Component, Inject, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { ICON_NAMES, IconNames, iconNames } from './injectables/icons.injectable';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [{ provide: ICON_NAMES, useValue: iconNames }],
})
export class AppComponent {
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private firebase: DataService,
    @Inject(ICON_NAMES) icons: IconNames
  ) {
    this.registerIcons(iconRegistry, sanitizer, icons);
  }

  private registerIcons(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, icons: IconNames) {
    Object.values(icons).forEach((icon) => {
      iconRegistry.addSvgIcon(
        icon,
        sanitizer.bypassSecurityTrustResourceUrl(`../assets/icons/${icon}.svg`)
      );
    });
  }
}

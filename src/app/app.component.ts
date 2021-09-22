import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { DataService } from './services/data.service';

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  ngOnInit(): void {}
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private firebase: DataService
  ) {
    iconRegistry.addSvgIcon(
      'light',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/filled-lightbulb.svg')
    );
    iconRegistry.addSvgIcon(
      'search',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/search.svg')
    );
    iconRegistry.addSvgIcon(
      'add-3',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/add-ic.svg')
    );
    iconRegistry.addSvgIcon(
      'filter',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/filter.svg')
    );
    this.iconRegistry.addSvgIcon(
      'add',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ion-add.svg')
    );
    this.iconRegistry.addSvgIcon(
      'add-2',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/add_ibm.svg')
    );
    this.iconRegistry.addSvgIcon(
      'delete',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ion-trash.svg')
    );
    iconRegistry.addSvgIcon(
      'error',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/error.svg')
    );
    iconRegistry.addSvgIcon(
      'warn',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ion_warn.svg')
    );
    iconRegistry.addSvgIcon(
      'unfold_less',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/unfold_less.svg')
    );
    iconRegistry.addSvgIcon(
      'remove_circle_outline',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/remove_circle_outline.svg')
    );
    iconRegistry.addSvgIcon(
      'remove',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ion-remove.svg')
    );
    iconRegistry.addSvgIcon(
      'add_circle_outline',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/add_circle_outline.svg')
    );
    iconRegistry.addSvgIcon(
      'unfold_more',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/unfold_more.svg')
    );
    iconRegistry.addSvgIcon(
      'expand_less',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/expand_less.svg')
    );
    iconRegistry.addSvgIcon(
      'chevron-right',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ibm-chevron--right.svg')
    );
    iconRegistry.addSvgIcon(
      'overflow_menu_vertical',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/overflow_menu_vertical.svg')
    );

    iconRegistry.addSvgIcon(
      'chevron-left',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ibm-chevron--left.svg')
    );
    iconRegistry.addSvgIcon(
      'arrow_right',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/arrow_right.svg')
    );
    iconRegistry.addSvgIcon(
      'pills_subtract',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/edit_note.svg')
    );
    iconRegistry.addSvgIcon(
      'menu',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/menu.svg')
    );
    iconRegistry.addSvgIcon(
      'heart-ekg',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/heart-ekg.svg')
    );
    iconRegistry.addSvgIcon(
      'prescription_bottle',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/prescription_bottle.svg')
    );
    iconRegistry.addSvgIcon(
      'chevron_down',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/chevron_down.svg')
    );
    iconRegistry.addSvgIcon(
      'kidneys',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/kidneys.svg')
    );
    iconRegistry.addSvgIcon(
      'capsule',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/capsule.svg')
    );
    iconRegistry.addSvgIcon(
      'general-health',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/general-health.svg')
    );
    iconRegistry.addSvgIcon(
      'elder_drug_logo',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/elder_drug_logo.svg')
    );
    iconRegistry.addSvgIcon(
      'scale',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/scale.svg')
    );
    iconRegistry.addSvgIcon(
      'tab_left',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/tab_left.svg')
    );
    iconRegistry.addSvgIcon(
      'tab_right',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/tab_right.svg')
    );
    iconRegistry.addSvgIcon(
      'cancel',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/cancel.svg')
    );
    iconRegistry.addSvgIcon(
      'remove_sharp',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/remove.svg')
    );
    iconRegistry.addSvgIcon(
      'expand_more',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/expand_more.svg')
    );
    iconRegistry.addSvgIcon('x', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/x.svg'));
    iconRegistry.addSvgIcon(
      'x_filled',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/x_filled_circle.svg')
    );
    iconRegistry.addSvgIcon(
      'x_outlined',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/x_outlined_circle.svg')
    );
    iconRegistry.addSvgIcon(
      'draggable',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/draggable.svg')
    );
    iconRegistry.addSvgIcon(
      'github',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/logo-github.svg')
    );
  }
  title = 'ElderDrug';
}

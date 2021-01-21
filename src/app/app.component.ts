import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { FirebaseService } from './firebase.service';
import { StateService } from './state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  ngOnInit(): void {}
  constructor(
    private state: StateService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private firebase: FirebaseService
  ) {
    this.firebase = firebase;
    iconRegistry.addSvgIcon(
      'search',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/search.svg')
    );
    this.iconRegistry.addSvgIcon(
      'add--outline',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/ion-add-circle-outline.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'delete',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/ion-trash.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'error',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/error.svg')
    );
    iconRegistry.addSvgIcon(
      'unfold_less',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/unfold_less.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'remove_circle_outline',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/remove_circle_outline.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'add_circle_outline',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/add_circle_outline.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'unfold_more',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/unfold_more.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'expand_less',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/expand_less.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'chevron_right',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/chevron_right.svg'
      )
    );

    iconRegistry.addSvgIcon(
      'chevron_left',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/chevron_left.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'arrow_right',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/arrow_right.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'menu',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/menu.svg')
    );
    iconRegistry.addSvgIcon(
      'heart-ekg',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/heart-ekg.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'chevron_down',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/chevron_down.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'kidneys',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/kidneys.svg')
    );
    iconRegistry.addSvgIcon(
      'capsule',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/capsule.svg')
    );
    iconRegistry.addSvgIcon(
      'general-health',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/general-health.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'elder_drug_logo',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/elder_drug_logo.svg'
      )
    );
    iconRegistry
      .addSvgIcon(
        'scale',
        this.sanitizer.bypassSecurityTrustResourceUrl(
          'assets/icons/scale.svg'
        )
      )
  }
  title = 'ElderDrug';
}

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PopupService } from '../../../../services/popup.service';

@Component({
  selector: 'elder-popup-placeholder',
  templateUrl: './popup-placeholder.component.html',
  styleUrls: ['./popup-placeholder.component.scss'],
  viewProviders: [{ provide: PopupService, useClass: PopupService }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopupContentComponent {
  get placeholder$() {
    return this.popupService.placeholder$;
  }
  constructor(private popupService: PopupService) {}
}

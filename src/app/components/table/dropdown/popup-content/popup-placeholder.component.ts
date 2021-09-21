import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PopupService } from '../../../../services/popup.service';

@Component({
  selector: 'popup-placeholder',
  templateUrl: './popup-placeholder.component.html',
  styleUrls: ['./popup-placeholder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopupContentComponent {
  get placeholder$() {
    return this.popupService.placeholder$;
  }
  constructor(private popupService: PopupService) {
    this.popupService.placeholder$.subscribe(console.log);
  }
}

import { ChangeDetectionStrategy, Component, HostBinding, Inject, Input } from '@angular/core';

import { ICON_NAMES, IconNames } from '../../injectables/icons.injectable';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'elder-directions',
  templateUrl: './directions.component.html',
  styleUrls: ['./directions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectionsComponent {
  @Input()
  hideDescription: boolean = false;
  @HostBinding('class.is-hidden')
  get hidden() {
    return !this.layoutService.areDirectionsShown;
  }

  hide() {
    this.layoutService.hideDirections();
  }
  show() {
    this.layoutService.showDirections();
  }
  constructor(@Inject(ICON_NAMES) public icons: IconNames, public layoutService: LayoutService) {}
}
